all: deps bin/blockwatcher bin/eventwatcher

deps:
	@command -v go >/dev/null 2>&1 || (echo "\n\tGo not installed; see README.md\n" ; exit 1)
	@command -v gb >/dev/null 2>&1 || (echo "\n\tgb not installed; see README.md\n" ; exit 1)
	@cd ..; \
		bin/gen.sh

bin/blockwatcher bin/eventwatcher:
	gb build all

clean:
	go clean ./...
	-rm -f gen_*.go
