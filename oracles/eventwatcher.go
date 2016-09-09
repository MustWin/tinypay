package oracles

import (
	"fmt"
	"time"

	"github.com/ethereum/go-ethereum/rpc"
	tomb "gopkg.in/tomb.v2"
)

// EventWatcher is responsible for watching for new events on the chain
// and emitting the log data of the event on the Ch channel.
type EventWatcher struct {
	tomb.Tomb
	Ch       chan interface{}
	interval time.Duration
	url      string
}

// NewEventWatcher returns a EventWatcher.
func NewEventWatcher(url string, pollInterval time.Duration) *EventWatcher {
	bw := &EventWatcher{
		Ch:       make(chan interface{}),
		interval: pollInterval,
		url:      url,
	}
	bw.Go(bw.loop)
	return bw
}

func (w *EventWatcher) loop() error {
	client, err := rpc.NewHTTPClient(w.url)
	if err != nil {
		return err
	}

	err = client.Send(NewEventFilter(""))
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
		case <-time.After(w.interval):
			fmt.Printf(".")
			err = client.Send(NewFilterChanges(filterID.Result))
			if err != nil {
				return err
			}
			err = client.Recv(&evt)
			if err != nil {
				return err
			}
			for _, rr := range evt.Result {
				w.Ch <- rr
			}
		}
	}
}
