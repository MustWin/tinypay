all: deps bin/blockwatcher bin/eventwatcher

deps:
	@command -v go >/dev/null || (echo "\n\tGo not installed; see README.md\n" ; exit 1)
	@command -v gb >/dev/null || (echo "\n\tgb not installed; see README.md\n" ; exit 1)

bin/blockwatcher bin/eventwatcher:
	gb build all
