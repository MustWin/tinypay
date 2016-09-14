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
	r            *BlockRange
}

// NewEventWatcher returns a EventWatcher. If the watchRange is nil the
// defaults will be used.
func NewEventWatcher(url string, pollInterval time.Duration, watchRange *BlockRange, account string, topics ...string) *EventWatcher {
	r := &BlockRange{From: EthLatest, To: EthLatest}
	if watchRange != nil {
		r = watchRange
	}
	bw := &EventWatcher{
		Ch:           make(chan LogEvent),
		interval:     pollInterval,
		url:          url,
		watchAccount: account,
		topics:       topics,
		r:            r,
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

	filter := TopicFilter{
		Address:    w.watchAccount,
		Topics:     w.topics,
		BlockRange: *w.r,
	}

	err = client.Send(NewEventFilter(filter))
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
		select {
		case <-w.Dying():
			return nil
		case <-time.After(w.interval):
			continue
		}
	}
}
