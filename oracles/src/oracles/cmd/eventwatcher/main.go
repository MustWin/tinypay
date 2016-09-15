package main

import (
	"bytes"
	"fmt"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/urfave/cli"

	"oracles"
)

func main() {
	app := cli.NewApp()
	app.Usage = "Watch events on an ethereum blockchain"
	app.Action = Main
	app.Version = "0.1.0"
	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:   "rpcurl",
			Value:  "http://127.0.0.1:8545",
			Usage:  "url for RPC connection to ethereum node",
			EnvVar: "ETH_RPCURL",
		},
		cli.IntFlag{
			Name:  "interval",
			Value: 15,
			Usage: "polling interval in seconds",
		},
	}
	app.Run(os.Args)
}

func Main(c *cli.Context) error {
	rpcurl := c.String("rpcurl")
	interval := time.Duration(c.Int("interval"))
	r := &oracles.BlockRange{
		From: "0x1",
		To:   "latest",
	}
	l := common.HashLength
	evtWatcher := oracles.NewEventWatcher(rpcurl, interval*time.Second, r, "")
	for evt := range evtWatcher.Ch {
		fmt.Printf("new event %+v\n", evt)
		d := common.FromHex(evt.Data)
		h := [][]byte{}
		for i := 0; i < len(d)/l; i++ {
			s := d[i*l : i*l+l]
			h = append(h, s)
			s = bytes.Trim(s, "\x00")
			fmt.Printf("\t\tIndex %d: string %q\n", i, string(s))
		}
	}
	return evtWatcher.Wait()
}
