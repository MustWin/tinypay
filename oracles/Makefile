all: deps blockwatcher eventwatcher

deps:
	@command -v go >/dev/null || (echo "\n\tGo not installed; see README.md\n" ; exit 1)
	@command -v gb >/dev/null || (echo "\n\tgb not installed; see README.md\n" ; exit 1)

blockwatcher: bin/blockwatcher
	gb build oracles/cmd/blockwatcher

eventwatcher: bin/eventwatcher
	gb build oracles/cmd/eventwatcher
