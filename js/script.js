var app = angular.module('dfa_web', []);
controllers = {};
controllers.app_controller = ($scope) => {
    var alert1 = "<div class='alert alert-success' style='display:none;'><strong>";
    var alert2 = "<div class='alert alert-danger' style='display:none;'><strong>";
    var alert_close = "</strong></div>";
    $scope.states = [];
    $scope.symbols = [];
    $scope.to_edit = {};
    $scope.to_view = {};
    $scope.initial = "";
    $scope.dispose_edit = () => {
        $("#edit_state").modal('hide');
        $scope.to_edit = {};
    }
    $scope.dispose_view = () => {
        $("#view_state").modal('hide');
        $scope.to_view = {};
    }
    $scope.new_set = () => {
        $("input").val("");
        $("#result>div").replaceWith("<div></div>");
        $("#result>div").hide();
        $("#add_op>div").replaceWith("<div></div>");
        $("#add_op>div").hide();
        $("#alpha_op>div").replaceWith("<div></div>");
        $("#alpha_op>div").hide();
        $scope.states = [];
        $scope.symbols = [];
        $scope.initial = "";
    }
    $scope.remove_state = (state_name) => {
        remove = confirm("Do you really want to remove this state ?");
        if (remove) {
            state = $scope.states.find(state => state.name == state_name);
            if (state != undefined) {
                index = $scope.states.indexOf(state);
                $scope.states.splice(index, 1);
            }
        }
    };
    $scope.set_alphabet = (alphabet) => {
        alphabet = (alphabet != undefined) ? alphabet.split(",") : [];
            alphabet.filter(a=>alphabet.filter(x=>x==a).length >1).map(i=>{if(alphabet.filter(x=>x==i).length>1)alphabet.splice(alphabet.indexOf(i),1);});
        if (alphabet.length > 1) {
            $scope.symbols = alphabet;
            $scope.states.map(state => state.paths = []);
            $("#alpha_op>div").replaceWith(alert1 + "Set Successfully" + alert_close);
            if (alphabet.find(a => $scope.symbols.find(x => x == a) == undefined) != undefined) {
                $scope.states.map(i => i.rempve_paths());
            }
        } else {
            $("#alpha_op>div").replaceWith(alert2 + "Alphabet Cannot be Empty set" + alert_close);
        }
        $("#alpha_op>div").slideDown();
    };
    $scope.set_all = () => {
        if (($scope.to_edit.initial == true && $scope.initial == "") || $scope.initial == $scope.to_edit.name) {
            $scope.states.find(state => state.name == $scope.to_edit.name).set_init($scope.to_edit.initial);
            if ($scope.to_edit.initial == false) {
                $scope.initial = "";
            } else {
                $scope.initial = $scope.to_edit.name;
            }
        }
        $scope.states[$scope.states.indexOf($scope.to_edit)].initial = $scope.to_edit.initial;
        $scope.dispose_edit();
    }
    $scope.remove_path = (state, path) => {
        con = confirm("Are you sure to remove the path ?");
        if (con) {
            index = state.paths.indexOf(path);
            state.paths.splice(index, 1);
        }
    };
    $scope.view_details = (state_name) => {
        state = $scope.states.find(state => state.name == state_name);
        if (state != undefined) {
            $scope.to_view = state;
            $("#view_state").modal('show');
        }
    }
    $scope.edit_details = (state_name) => {

        state = $scope.states.find(state => state.name == state_name);
        if (state != undefined) {
            $scope.to_edit = state;
            $("#edit_state").modal('show');
        }
    }
    $scope.add_path = (src, dist, input) => {
        if (src != undefined && dist != undefined && input != undefined) {
            dist = $scope.states.find(state => state.name == dist);
            src = $scope.states.find(state => state.name == src);
            if (src != undefined && dist != undefined) {
                added = src.add_path(new Path(dist, input));
                if (added) {
                    // console.log("added");
                } else {
                    // console.log("existing");
                }
            } else {

                // console.log("not found !!");
            }
        }
    }
    $scope.add_state = (state_name) => {
        if ($scope.states.find(state => state.name == state_name) == undefined && state_name != undefined) {
            $scope.states.push(new State(state_name));
            $("#add_op>div").replaceWith(alert1 + "Added Successfully" + alert_close);
        }
        else {
            if (state_name == undefined) {
                $("#add_op>div").replaceWith(alert2 + "The State Name is empty !" + alert_close);
            } else {
                $("#add_op>div").replaceWith(alert2 + "The State is Already Added !" + alert_close);
            }
        }
        $("#add_op>div").slideDown();
    }
    $scope.test_word = (word) => {
        //check if all clear ?
        if (word != undefined) {
            if (word.split("").find(s => $scope.symbols.find(x => x == s) == undefined) == undefined) {
                errors = $scope.states.filter(state => state.paths.length < $scope.symbols.length);
                if (errors.length == 0 && $scope.states.find(state => state.final == true) != undefined) {
                    initial = $scope.states.find(state => state.initial == true);
                    if (initial != undefined) {
                        initial.index = 0;
                        result = initial.take_path(word);
                        if (result == true) {
                            $("#result>div").replaceWith(alert1 + "Accepted" + alert_close);
                        } else {
                            $("#result>div").replaceWith(alert2 + "Rejicted" + alert_close);
                        }
                    } else {
                        str_error = "There is no Initial state ";
                        $("#result>div").replaceWith(alert2 + str_error + alert_close);

                    }

                } else {
                    if (errors.length != 0) {
                        str_error = "States " + errors.reduce((c, n) => ((c.name != undefined) ? c.name : c) + " , " + n.name) + " dont have enough paths , DFA is not implemented";
                        $("#result>div").replaceWith(alert2 + str_error + alert_close);
                    } else {
                        //no final state
                        if ($scope.states.length == 0) {
                            str_error = "There is no states in the DFA ";
                        } else {
                            str_error = "There is no Final state ";
                        }
                        $("#result>div").replaceWith(alert2 + str_error + alert_close);

                    }
                }
            } else {
                $("#result>div").replaceWith(alert2 + "The word has letters dont belong to DFA Alphabet" + alert_close);

            }
        } else {
            $("#result>div").replaceWith(alert2 + "Empty String is not Allowed" + alert_close);

        }
        $("#result>div").slideDown();
    }
    $scope.load = () => {
        var file_name = $("input[type=file]")[0].files[0];
        $scope.new_set();
        var file_reader = new FileReader();
        file_reader.onloadend = function (e) {
            data = JSON.parse(e.target.result);
            if (data.DFA != undefined) {
                $scope.states = [];
                $scope.symbols = data.symbols;
                data.states.map((i) => {
                    state = new State(i.name);
                    state.final = i.final;
                    state.initial = i.initial;
                    if (i.initial) {
                        $scope.initial = i.name;
                    }
                    i.paths.map(path => state.add_path(new Path(path.dist.name, path.input)));
                    $scope.states.push(state);
                });
                $scope.$apply();
            }
        }
        file_reader.readAsText(file_name);
    }
    $scope.save = () => {
        if ($scope.states.length > 0)
            download("DFA.json", JSON.stringify({ states: $scope.states, symbols: $scope.symbols, DFA: "dfa_web" }));
    }

};
app.controller(controllers);
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.setAttribute('target', '_blank');
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
