 class Istate {
        constructor() { }
        canvasClick() { }
        canvasDoubleClick() { }
        placeClick() { }
        transitionClick() { }
        AddnodeClick() { }
        AddEdgeClick() { }
        SelectedButtonUpdate() { }
        keydownEvent() { }
        executionClick() { }
    }

    class DefaultState extends Istate {
        constructor() { super(); }

        canvasClick(node, event) {
            //clicked on empty spot -> deselect
            deselect();
        }

        canvasDoubleClick() { }
        placeClick(node, event) {
            //set current place as selected
            selected.children[0].text = "Selected: " + node.name;
            selected.current = node;
            selected.redraw();
            event.stopPropagation();
            state.currentState = state.selectionState;
        }
        
        transitionClick(node, event) {
            selected.children[0].text = "Selected: " + node.name;
            selected.current = node;
            selected.redraw();
            event.stopPropagation();
            state.currentState = state.selectionState;
        }

        AddnodeClick(button) {
            $nodes.push(new Place($canvas.width / 2, $canvas.height / 2, 50, "P" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));
        }
        AddEdgeClick() { console.log("select node first!") }

        keydownEvent(event) {
            if (event.which == 84) //= key T
                $nodes.push(new Transition($canvas.mouse.x - 50, $canvas.mouse.y - 50, 50, "T" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));//createTransition($canvas.mouse.x - 50, $canvas.mouse.y - 50, 100, "T" + Math.round(Math.random() * 100)));
            if (event.which == 65)  //key A
                $nodes.push(new Place($canvas.mouse.x, $canvas.mouse.y, 50, "P" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));
        }

        executionClick(button, event) {
            switchToExecState(button);
        }
    }

    function switchToExecState(button) {
        //switch state and button
        state.currentState = state.executionState;
        button.children[0].text = "Execution Mode";
        button.children[0].fill = "red";

        //create new currentStaet in the context of coverability graph. The new state has null as parent

        currentState = new PetriNetState();
        petrinetStates.push(currentState);
        console.log(currentState)
        console.log(currentState.id)

        //disable drag & drop
        $nodes.forEach(function (element) { element.dragAndDrop(false); })

        //check each transition for fire eligibility (green = allowed to Fire())
        $nodes.forEach(function (node) {
            if (node instanceof Transition)
                node.readyCheck();
            else node.originalTokens = node.tokens;  //remember token amount b4 execution
        });
    }

    class SelectionState extends Istate {
        constructor() { super(); }
        canvasDoubleClick() { }
        canvasClick() {
            deselect();
            state.currentState = state.defaultState;
        }

        placeClick(node, event) {
            //switch to selected
            selected.children[0].text = "Selected: " + node.name;
            selected.current = node;
            selected.redraw();
            event.stopPropagation();
        }

        transitionClick(node, event) {
            selected.children[0].text = "Selected: " + node.name;
            selected.current = node;
            selected.redraw();
            event.stopPropagation();
        }

        AddnodeClick() { }

        AddEdgeClick() {
            var line = $canvas.display.line({
                start: { x: selected.current.x, y: selected.current.y },
                end: { x: $canvas.mouse.x, y: $canvas.mouse.y },
                stroke: "11px #0aa",
                cap: "round"
            }).add();

            edgePending = line;

            //switch state
            state.currentState = state.edgePendingState;
        }

        keydownEvent(event) {
            if (event.which == 69) //simulate clicking on adding edge button by pressing E
                state.currentState.AddEdgeClick();
        }

        executionClick(button, event) {
            deselect();
            switchToExecState(button);
        }
    }

    class ExecutionState extends Istate {
        constructor() { super(); }
        canvasClick() { } //nothing
        placeClick() { }

        transitionClick(node, event) {
            if (node.classPointer.readyCheck()) {

                //fire the transition and swallow the nodes
                node.classPointer.fire();

                // add the new state then replace the currentstate with the new one
                var newState = new PetriNetState(currentState);
                var idx;
                if ((idx = $.inArray(newState.id, petrinetStates.map(i => i.id))) != -1) { }

                currentState.nextStates.push(newState);
                currentState = newState

                //add the new state in the distinct list of states
                petrinetStates.push(currentState);

                console.log(currentState)
                console.log(currentState.id)
            }
            $nodes.forEach(function (elem) { if (elem instanceof Transition) elem.readyCheck(); /*set color */ })
        }

        AddnodeClick(node, event) { }
        AddEdgeClick() { /* do nothing */ }
        keydownEvent() { }
        executionClick(button, event) {
            //go back to default mode;
            button.children[0].text = "Execution";
            button.children[0].fill = "#fff";
            state.currentState = state.defaultState;
            event.stopPropagation();

            $nodes.forEach(function (node) {
                AddDragAndDrop(node);
                node.drawObject.stroke = "5px red"; //reset colors

                if (node instanceof Place) {
                    node.tokens = node.originalTokens;
                    // node.tokensPlate.text = node.tokens; //reset token text
                }

                node.redraw();
            });
        }
    }

    function edgePlacementValidation(node) {
        if (selected.current === node) {
            console.log('cant point to self!')
            return false;
        }

        if (selected.current.nodeType == node.nodeType) {   //TODO: CHANGE TO INSTANCEOF
            console.log("same type!")
            return false;
        }

        var mapped = node.incomingEdges.map(function (item) { return item.From; });

        if ($.inArray(selected.current, mapped) != -1) {
            console.log("edge already exists");
            return false;
        }

        return true;
    }

    class EdgePendingState extends Istate {
        constructor() { super(); }
        canvasClick() { console.log("click on an object") }

        placeClick(node, event) {

            if (!edgePlacementValidation(node)) return;

            var newEdge = createEdge(selected.current, node);
            // selected.current = null;
            edgePending.remove();
            edgePending = null;
            event.stopPropagation();
            //switch states
            state.currentState = state.selectionState;
        }

        transitionClick(node, event) {
            if (!edgePlacementValidation(node)) return;

            var newEdge = createEdge(selected.current, node);
            //selected.current = null;
            edgePending.remove();
            edgePending = null;
            event.stopPropagation();
            //switch states
            state.currentState = state.selectionState;
        }

        AddnodeClick() { }
        AddEdgeClick() { }
        keydownEvent(event) {
            edgePending.remove();
            edgePending = null;
            state.currentState = state.selectionState;
        }
    }

    class ReachabilityState extends Istate {
        constructor() { super(); }
        canvasClick() { }
        canvasDoubleClick() { }
        placeClick() { }
        transitionClick() { }
        AddnodeClick() { }
        AddEdgeClick() { }
        SelectedButtonUpdate() { }
        keydownEvent() { }
        executionClick() { }
    }

    class State {
        constructor() {
            this.defaultState = new DefaultState();
            this.selectionState = new SelectionState();
            this.executionState = new ExecutionState();
            this.edgePendingState = new EdgePendingState();
            this.reachabilityState = new ReachabilityState();
            this.currentState = this.defaultState;
        }
    }

    function deselect() {
        selected.current = null;
        selected.children[0].text = "None selected";
        selected.redraw();
    }


    function createEdge(nodeA, nodeB) {
        var line = $canvas.display.line({
            start: { x: nodeA.x, y: nodeA.y },
            end: { x: nodeB.x, y: nodeB.y },
            stroke: "11px #0aa",
            cap: "butt"
        });

        nodeA.outgoingEdges.push(line);
        nodeB.incomingEdges.push(line);
        line.From = nodeA;
        line.To = nodeB;
        line.redraw();

        var triangle = $canvas.display.polygon({
            x: 0,
            y: 0,
            sides: 3,
            radius: 20,
            rotation: 0,
            fill: "#0da"
        });
        line.addChild(triangle);

        lineOnEdge(nodeA);
        lineOnEdge(nodeB);
        $canvas.addChild(line);
        line.zIndex = 0;
        triangle.zIndex = 3;    //doesnt work?
    }