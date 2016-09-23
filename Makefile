rwildcard=$(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2) $(filter $(subst *,%,$2),$d))

all: eth/build web/output web/templates/js/contracts.js oracles/DomainMicropay.sol.js

clean:
	-rm -rf eth/build
	-rm -rf web/output

eth/build: $(call rwildcard, eth, *.sol *.js)
	@cd eth; \
		truffle build; \
		cp build/app.js ../web/templates/js/contracts.js ; \
		cp build/contracts/DomainMicropay.sol.js ../oracles/DomainMicropay.sol.js

web/output: $(call rwildcard, web, *.json *.mustache *.markdown *.js)
	@cd web; \
		punch g

web/templates/js/contracts.js: eth/build
		@cp eth/build/app.js web/templates/js/contracts.js

oracles/DomainMicropay.sol.js: eth/build
		@cp eth/build/contracts/DomainMicropay.sol.js oracles/DomainMicropay.sol.js

.PHONY: all clean
