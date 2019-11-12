$(document).ready(function() {
  $(".counter").counterUp({
        delay: 10,
        time: 1500
    }),(new WOW).init(), particlesJS("particles-js", {
        particles: {
            number: {
                value: 90,
                density: {
                    enable: !0,
                    value_area: 800
                }
            },
            color: {
                value: "FFFFFF"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#FFFFFF"
                },
                polygon: {
                    nb_sides: 5
                },
                image: {
                    src: "img/github.svg",
                    width: 100,
                    height: 100
                }
            },
            opacity: {
                value: .15,
                random: !1,
                anim: {
                    enable: !1,
                    speed: 1,
                    opacity_min: .1,
                    sync: !1
                }
            },
            size: {
                value: 5,
                random: !0,
                anim: {
                    enable: !1,
                    speed: 40,
                    size_min: .1,
                    sync: !1
                }
            },
            line_linked: {
                enable: !0,
                distance: 150,
                color: "FFFFFF",
                opacity: .1,
                width: 1
            },
            move: {
                enable: !0,
                speed: 1,
                direction: "none",
                random: !1,
                straight: !1,
                out_mode: "out",
                bounce: !1,
                attract: {
                    enable: !1,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: !0,
                    mode: "grab"
                },
                onclick: {
                    enable: !0,
                    mode: "bubble"
                },
                resize: !0
            },
            modes: {
                grab: {
                    distance: 350,
                    line_linked: {
                        opacity: .65
                    }
                },
                bubble: {
                    distance: 350,
                    size: 12,
                    duration: 1.542946703372556,
                    opacity: .9,
                    speed: 3
                },
                repulse: {
                    distance: 350,
                    duration: .4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: !0
    });

    $('#cfs').on('submit', function(e) {
      e.preventDefault();

      alert('OK!');
    });
});
