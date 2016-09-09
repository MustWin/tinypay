rwildcard=$(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2) $(filter $(subst *,%,$2),$d))

all: eth/build web/output orcl

clean:
	-rm -rf eth/build
	-rm -rf web/output
	cd oracles && go clean ./...

eth/build: $(call rwildcard, eth, *.sol *.js)
	cd eth && truffle build

web/output: $(call rwildcard, web, *.json *.mustache *.markdown *.js)
	cd web && punch g

orcl: $(call rwildcard, oracles, *.go)
	cd oracles && go install -v ./...


.PHONY: all clean orcl
