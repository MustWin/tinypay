package oracles

import (
	"time"

	"github.com/ethereum/go-ethereum/rpc"
	tomb "gopkg.in/tomb.v2"
)

// EventWatcher is responsible for watching for new events on the chain
// and emitting the log data of the event on the Ch channel.
type EventWatcher struct {
	tomb.Tomb
	Ch           chan LogEvent
	interval     time.Duration
	url          string
	watchAccount string
	topics       []string
}

// NewEventWatcher returns a EventWatcher.
func NewEventWatcher(url string, pollInterval time.Duration, account string, topics ...string) *EventWatcher {
	bw := &EventWatcher{
		Ch:           make(chan LogEvent),
		interval:     pollInterval,
		url:          url,
		watchAccount: account,
		topics:       topics,
	}
	bw.Go(bw.loop)
	return bw
}

func (w *EventWatcher) Stop() error {
	w.Kill(nil)
	return w.Wait()
}

func (w *EventWatcher) loop() error {
	defer close(w.Ch)

	client, err := rpc.NewHTTPClient(w.url)
	if err != nil {
		return err
	}

	err = client.Send(NewEventFilter(w.watchAccount, w.topics...))
	if err != nil {
		return err
	}

	filterID := filterResult{}
	err = client.Recv(&filterID)
	if err != nil {
		return err
	}

	evt := eventResult{}
	for {
		select {
		case <-w.Dying():
			return nil
		case <-time.After(w.interval):
			err = client.Send(NewFilterChanges(filterID.Result))
			if err != nil {
				return err
			}
			err = client.Recv(&evt)
			if err != nil {
				return err
			}
			for _, logEvt := range evt.Result {
				w.Ch <- logEvt
			}
		}
	}
}
