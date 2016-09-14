package main

import (
	"fmt"
	"os"
	"time"

	"github.com/urfave/cli"

	"oracles"
)

func main() {
	app := cli.NewApp()
	app.Action = Main
	app.Run(os.Args)
}

func Main(c *cli.Context) error {
	r := &oracles.BlockRange{
		From: "0x1",
		To:   "latest",
	}
	evtWatcher := oracles.NewEventWatcher("http://127.0.0.1:8545", 15*time.Second, r, "")
	for evt := range evtWatcher.Ch {
		fmt.Printf("new event %+v\n", evt)
	}
	return nil
}
