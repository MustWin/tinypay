package oracles

import (
	"fmt"
	"time"

	"github.com/ethereum/go-ethereum/rpc"
	tomb "gopkg.in/tomb.v2"
)

// BlockWatcher is responsible for watching for new blocks on the chain
// and emitting the ID's of the new block on the Ch channel.
type BlockWatcher struct {
	tomb.Tomb
	Ch       chan string
	interval time.Duration
	url      string
}

// NewBlockWatcher returns a BlockWatcher.
func NewBlockWatcher(url string, pollInterval time.Duration) *BlockWatcher {
	bw := &BlockWatcher{
		Ch:       make(chan string),
		interval: pollInterval,
		url:      url,
	}
	bw.Go(bw.loop)
	return bw
}

func (w *BlockWatcher) loop() error {
	client, err := rpc.NewHTTPClient(w.url)
	if err != nil {
		return err
	}

	id := 0
	err = client.Send(req{Method: "eth_newBlockFilter", ID: fmt.Sprintf("%d", id)})
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

	for {
		id++
		select {
		case <-time.After(w.interval):
			err = client.Send(req{Method: "eth_getFilterChanges", Params: []string{filterID}, ID: fmt.Sprintf("%d", id)})
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
				bid, ok := rr.(string)
				if !ok {
					continue
				}
				w.Ch <- bid
			}
		}
	}
}
