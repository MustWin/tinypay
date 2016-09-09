package oracles

import (
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

	err = client.Send(NewBlockFilter())
	if err != nil {
		return err
	}

	filterID := filterResult{}
	err = client.Recv(&filterID)
	if err != nil {
		return err
	}

	br := blockResult{}
	for {
		select {
		case <-time.After(w.interval):
			err = client.Send(NewFilterChanges(filterID.Result))
			if err != nil {
				return err
			}
			err = client.Recv(&br)
			if err != nil {
				return err
			}
			for _, blockID := range br.Result {
				w.Ch <- blockID
			}
		}
	}
}
