package oracles

import (
	"fmt"
	"time"

	"github.com/ethereum/go-ethereum/rpc"
	tomb "gopkg.in/tomb.v2"
)

// EventWatcher emits events.
type EventWatcher struct {
	tomb.Tomb
	Ch       chan map[string]interface{}
	interval time.Duration
	url      string
}

// NewEventWatcher returns a EventWatcher.
func NewEventWatcher(url string, pollInterval time.Duration) *EventWatcher {
	bw := &EventWatcher{
		Ch:       make(chan map[string]interface{}),
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

	id := 0
	rq := req{
		Method: "eth_newFilter",
		Params: []interface{}{map[string]interface{}{
			"fromBlock": "latest",
			"topics":    []string{},
		}},
		ID: fmt.Sprintf("evt_%d", id),
	}
	err = client.Send(rq)
	if err != nil {
		return err
	}

	r := res{}
	err = client.Recv(&r)
	if err != nil {
		return err
	}

	filterID, ok := r.Result.(string)
	if !ok {
		return fmt.Errorf("result type unexpected: %T %#v", r.Result, r.Result)
	}

	fmt.Printf("here\n")

	for {
		id++
		select {
		case <-time.After(w.interval):
			fmt.Printf(".")
			err = client.Send(req{Method: "eth_getFilterChanges", Params: []string{filterID}, ID: fmt.Sprintf("evt_%d", id)})
			if err != nil {
				return err
			}
			err = client.Recv(&r)
			if err != nil {
				return err
			}
			results, ok := r.Result.([]interface{})
			if !ok {
				continue
			}
			for _, rr := range results {
				log, ok := rr.(map[string]interface{})
				if !ok {
					continue
				}
				w.Ch <- log
			}
		}
	}
}
