#
# VARIABLES
#
LESSOBJS = $(shell pwd)/pages/vimflowy.less
CSSOBJS = $(LESSOBJS:.less=.css)
LESSC = $(which lessc)


.PHONY: build install


install:
	@bower install


#
# BUILD CSS
#
build: $(CSSOBJS)


$(CSSOBJS): $(LESSOBJS)
	@cd pages && $(LESSC) $< > $@
