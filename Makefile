rwildcard=$(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2) $(filter $(subst *,%,$2),$d))

all: eth web

eth: $(call rwildcard, eth, *.sol *.js)
	cd eth && truffle build

web: $(call rwildcard, web, *.sol *.js)
	cd web && punch g
