#
# VARIABLES
#
LESSOBJS = $(shell pwd)/pages/vimflowy.less
CSSOBJS = $(LESSOBJS:.less=.css)
LESSC = 'which lessc'


.PHONY: build


#
# BUILD CSS
#
build: $(CSSOBJS)


$(CSSOBJS): $(LESSOBJS)
	@cd pages && $(LESSC) $< > $@
