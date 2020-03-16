var wis_claw_machine = {
    toys: [],
    backToys: [],
    isDragging: false,
    toyOffset: {},
    clawBallOffset: {},
    wintoy: {},
    wintoyindex: "",
    htmlToy: {},
    sensitivity_leftOffset: 31,
    sensitivity_rightOffset: 40,
    sensitivity_topOffset: 10,
    clawMachineImageUrl: "img/son.png",
    clawLeft: "img/clawleft.png",
    clawRight: "img/clawright.png",
    selector: "",
    setToys: function(o, count) {
        if (Array.isArray(o)) {
            var tp = 0;
            var pre_toys = [];
            toy_object.forEach(function(item) {
                pre_toys.push(wis_claw_machine.createProbability(item.message, tp, tp + item.weight));
                tp = tp + item.weight;
            });
            for (i = 0; i < count; i++) {
                var random_value = Math.floor(Math.random() * 100);
                pre_toys.forEach(function(t) {
                    if (t.ws <= random_value && random_value < t.we) {
                        wis_claw_machine.toys.push(wis_claw_machine.createToy(t.message, t.ws, t.we));
                    }
                });
            }
        }
    },
    callbackSuccess: function(slo, sro, sto) {
        if (slo != undefined && slo != "") {
            this.sensitivity_leftOffset = slo;
        }
        if (sro != undefined && sro != "") {
            this.sensitivity_rightOffset = sro;
        }
        if (sto != undefined && sto != "") {
            this.sensitivity_topOffset = sto;
        }
        wis_claw_machine.clawBallOffset = $("#clawBall").offset();
        var horizontalOK = ((wis_claw_machine.clawBallOffset.left - wis_claw_machine.sensitivity_leftOffset) < wis_claw_machine.toyOffset.left) && ((wis_claw_machine.clawBallOffset.left + wis_claw_machine.sensitivity_rightOffset) > wis_claw_machine.toyOffset.left + 50);
        if ((wis_claw_machine.clawBallOffset.top + wis_claw_machine.sensitivity_topOffset) > wis_claw_machine.toyOffset.top && horizontalOK) {
            /*  WIN (TAKE THE TOY)*/
            $("#clawALL,#clawBar").stop();
            wis_claw_machine.closeClaws();
            var htmlToy = "<div class='toy' style='background-position:" + (wis_claw_machine.toys[wis_claw_machine.wintoyindex].col) * 50 + "px" + " " + (wis_claw_machine.toys[wis_claw_machine.wintoyindex].row) * 50 + "px" + ";top:35px;left:6px;'></div>";
            $(".toy").remove();
            $("#clawALL").append(htmlToy);
            $("#clawBar").stop().animate({
                "height": "15px"
            }, {
                duration: 1000,
                easing: "linear",
                complete: function() {}
            });
            $("#clawALL").stop().animate({
                "top": "0px"
            }, {
                duration: 1000,
                easing: "linear",
                complete: function() {
                    $("#claw").stop().animate({
                        "left": "30px"
                    }, {
                        duration: 1000,
                        easing: "linear",
                        complete: function() {
                            wis_claw_machine.openClaws();
                            $(".toy").stop().animate({
                                "top": "+=260px"
                            }, {
                                duration: 1000,
                                easing: "linear",
                                complete: function() {
                                    $(".toy").css({
                                        "z-index": "100",
                                        "animation": "fullsize 1s 1 linear",
                                        "transform": "scale(4) translate(30px,-30px)"
                                    });
                                    setTimeout(function() {
                                        $(".toy").stop().animate({
                                            "opacity": "0"
                                        }, {
                                            duration: 500,
                                            easing: "linear",
                                            complete: function() {
                                                $("#moveControl").css("left", "-2px");
                                                $("#moveContainer").show();
                                                $(".toy").remove();
                                                wis_claw_machine.placeToy(wis_claw_machine.toys);
                                            }
                                        });
                                    }, 1500);
                                }
                            });
                            setTimeout(function() {
                                wis_claw_machine.closeClaws();
                            }, 300);
                        }
                    });
                }
            });
        }
    },
    callbackFailure: function(slo, sro, sto) {
        if (slo != undefined && slo != "") {
            this.sensitivity_leftOffset = slo;
        }
        if (sro != undefined && sro != "") {
            this.sensitivity_rightOffset = sro;
        }
        if (sto != undefined && sto != "") {
            this.sensitivity_topOffset = sto;
        }
        wis_claw_machine.closeClaws();
        $("#clawBar").stop().animate({
            "height": "-=180px"
        }, {
            duration: 1000,
            easing: "linear",
            complete: function() {}
        });
        $("#clawALL").stop().animate({
            "top": "-=180px"
        }, {
            duration: 1000,
            easing: "linear",
            complete: function() {
                $("#claw").stop().animate({
                    "left": "30px"
                }, {
                    duration: 1000,
                    easing: "linear",
                    complete: function() {
                        wis_claw_machine.openClaws();
                        setTimeout(function() {
                            wis_claw_machine.closeClaws();
                            $("#moveControl").css("left", "-2px");
                            $("#moveContainer").show();
                            $(".toy").remove();
                            wis_claw_machine.placeToy(wis_claw_machine.toys);

                        }, 300);
                    }
                });
            }
        });
    },
    setMachine: function(mimg, cl, cr) {
        if (mimg != undefined && mimg != "") {
            this.clawMachineImageUrl = mimg;
        }
        if (cl != undefined && cl != "") {
            this.clawLeft = cl;
        }
        if (cr != undefined && cr != "") {
            this.clawRight = cr;
        }
    },
    createToy: function(message, ws, we) {
        var toy = {
            col: Math.floor(Math.random() * 7),
            row: Math.floor(Math.random() * 7),
            top: Math.floor(Math.random() * 70),
            left: Math.floor(Math.random() * 160),
            mesaj: message,
            ws: ws,
            we: we
        };
        return toy;
    },
    createProbability: function(message, ws, we) {
        var pr = {
            message: message,
            ws: ws,
            we: we
        }
        return pr;
    },
    createToys: function(count, message) {
        var toys = [];
        for (i = 0; i < count; i++) {
            toys.push(wis_claw_machine.createToy(message));
        }
        return toys;
    },
    openClaws: function() {
        $("#clawimg2,#clawimg1").css({
            "transform": "rotate(0deg)"
        });
    },
    closeClaws: function() {
        $("#clawimg2").css({
            "transform": "rotate(30deg)"
        });
        $("#clawimg1").css({
            "transform": "rotate(-30deg)"
        });
    },
    placeToy: function(toys) {
        toys.map((toy, i) => {
            htmlToy = "<div class='toy toy-" + i + "' style='background-position:" + toy.col * 50 + "px " + toy.row * 50 + "px;top:" + (toy.top) + "px;left:" + (toy.left) + "px;'></div>";
            return $("#toys").append(htmlToy);
        });
    },
    placeToyBack: function(backToys) {
        backToys.map((toy, i) => {
            htmlToyBack = "<div class='toyy toy-" + i + 1 + "' style='background-position:" + toy.col * 50 + "px " + toy.row * 50 + "px;top:" + (toy.top) + "px;left:" + (toy.left) + "px;'></div>";
            return $("#toys").append(htmlToyBack);
        });
    },
    comparison: function(toys) {
        toys.forEach(function(i, j) {
            var toyoffset = $(".toy:nth(" + j + ")").offset();
            var clawBallOffset = $("#clawBall").offset();
            var horizontalOK = ((clawBallOffset.left - wis_claw_machine.sensitivity_leftOffset) < toyoffset.left) && ((clawBallOffset.left + wis_claw_machine.sensitivity_rightOffset) > toyoffset.left + 50);
            if ((clawBallOffset.top + wis_claw_machine.sensitivity_topOffset) < toyoffset.top && horizontalOK) {
                if (wis_claw_machine.wintoy != "" && wis_claw_machine.wintoy != undefined) {
                    wis_claw_machine.wintoyindex = j;
                    wis_claw_machine.wintoy = toyoffset;
                    //     if (wis_claw_machine.wintoy.top > toyoffset.top) {
                    //         wis_claw_machine.wintoyindex = j;
                    //         wis_claw_machine.wintoy = toyoffset;
                    //     }
                    // } else {
                    //     wis_claw_machine.wintoyindex = j;
                    //     wis_claw_machine.wintoy = toyoffset;
                }
            }
        });
    },
    handle_horizontal: function(ev) {
        var elem = ev.target;
        if (!wis_claw_machine.isDragging) {
            isDragging = true;
            lastPosX = elem.offsetLeft;
        }
        var posX = ev.deltaX + lastPosX;
        if (posX < -2) posX = -2;
        if (posX > 193) posX = 193;
        elem.style.left = posX + "px";
        var clawPosX = posX * 165 / 193 + 105;
        $("#claw").css({
            "left": (clawPosX) + "px"
        });
        $("#b_drop").show();
        if (ev.isFinal) {
            isDragging = false;
        }
    },
    run: function(cbs, cbf) {
        $('body').append('<div id="main"><img class="newClaw" src="' + this.clawMachineImageUrl + '" /> <button id="b_drop" class="take">SEÇ</button><div id="toys"></div><div id="claw"><div id="clawBar"></div><div id="clawALL"><div id="clawBall"></div> <img id="clawimg1" class="clawimg1"  src="' + this.clawLeft + '" /> <img id="clawimg2" class="clawimg2"  src="' + this.clawRight + '" />  </div></div><div id="moveContainer"><div id="moveControl"></div></div></div>');

        $(document).ready(function() {
            $("body").on("click", "#b_drop", function() {
                wis_claw_machine.comparison(wis_claw_machine.toys);
                wis_claw_machine.toyOffset = wis_claw_machine.wintoy;
                if (wis_claw_machine.toyOffset !== undefined && wis_claw_machine.toyOffset !== null) {
                    // $("#b_drop,#moveContainer").hide();
                    wis_claw_machine.openClaws();
                    $("#clawBar").stop().animate({ "height": "+=180px" }, { duration: 1000, easing: "linear", complete: function() {} });
                    $("#clawALL").stop().animate({ "top": "+=180px" }, {
                        duration: 1000,
                        easing: "linear",
                        step: function() {
                            wis_claw_machine.callbackSuccess();
                        },
                        complete: function() {
                            wis_claw_machine.callbackFailure();
                        }
                    });
                } else {
                    console.log('Lose');

                    function lose() {
                        //$("#b_drop,#moveContainer").hide();
                        wis_claw_machine.openClaws();
                        $("#clawBar").stop().animate({
                            "height": "+=180px"
                        }, {
                            duration: 1000,
                            easing: "linear",
                            complete: function() {}
                        });
                        $("#clawBar").stop().animate({
                            "height": "+=180px"
                        }, {
                            duration: 1000,
                            easing: "linear",
                            complete: function() {}
                        });
                        $("#clawALL").stop().animate({
                            "top": "+=180px"
                        }, {
                            duration: 1000,
                            easing: "linear",
                            complete: function() {
                                wis_claw_machine.callbackFailure();
                            }
                        });
                    }
                    lose();
                }
            });

            var horizontal = document.getElementById("moveControl");
            var mc_horizontal = new Hammer(horizontal);
            mc_horizontal.add(new Hammer.Pan({
                direction: Hammer.DIRECTION_HORIZONTAL,
                threshold: 0
            }));
            mc_horizontal.on("pan", wis_claw_machine.handle_horizontal);
            wis_claw_machine.placeToy(wis_claw_machine.toys);
            wis_claw_machine.placeToyBack(wis_claw_machine.backToys);

        });
    },
};