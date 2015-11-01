d	= $(HOME)/public-html/f15-520/both

%.js	: %.ts
	  tsc $< || rm -f $@

$(d)/%.js \
	: %.js
	  cp $< $@

tf	= test.js
tests	:
	  tsc --out $(tf) Coordinate.ts test-Coordinate.ts && nodejs $(tf)
	  tsc --out $(tf) dfs-grid.ts test-dfsgridstate.ts && nodejs $(tf)
	  tsc --out $(tf) dfs-grid.ts test-dfsgridfrontier.ts && nodejs $(tf)
	  tsc --out $(tf) dfs-grid.ts test-dfsgridproblem.ts && nodejs $(tf)
	  tsc --out $(tf) dfs-grid.ts test-dfsgridsolver.ts && nodejs $(tf)
	  tsc --out $(tf) test-bfsgridstate.ts && nodejs $(tf)
	  tsc --out $(tf) test-bfsgridsolver.ts && nodejs $(tf)
	  tsc --out $(tf) test-bfsgridsolver.ts && nodejs $(tf)
	  tsc --out $(tf) test-hdfsgridsolver.ts && nodejs $(tf)
	  tsc --out $(tf) test-asgridsolver.ts && nodejs $(tf)
	  tsc --out $(tf) test-dpgridstates.ts && nodejs $(tf)
	  tsc --out $(tf) test-dpgridsolver.ts && nodejs $(tf)

update	: $(d)/hw1solutions.js

hw1solutions.js	\
	: dfs-grid.ts bfs-grid.ts hdfs-grid.ts as-grid.ts dp-grid.ts grid.ts \
	  indexed-grid.ts 
	  tsc --out $@ $^

clean	:
	  rm -f test.js hw1solutions.js
	  crm ; for f in *.ts ; do \
	    rm -f $$(basename $$f .ts).js ; \
	  done
