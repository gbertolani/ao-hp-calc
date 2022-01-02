/** 
 * AOHpCalculator : Simple Ao Health calculator
 * Author : Gaston Bertolani
 * Version : 1.0.0
 */

let STANDAR_CONFIG = {
    server_name: 'Tierras del Sur',
    class_avg: {
        asesino: 7.75,
        bardo: 7.75,
        druida: 7.75,
        clerigo: 7.75,
        mago: 6.25,
        paladin: 9.25,
        cazador: 8.75,
        guerrero: 9.75,
        pirata: 9.75,
        minero: 9.75,
        talador: 9.75,
        pescador: 9.75,
        recolector: 9.75,
        carpintero: 7.25,
        herrero: 7.25,
        sastre: 7.25,
    },
    race_avg: {
        humano: 0.25,
        elfo: -0.25,
        eo: -0.25,
        enano: 0.75,
        gnomo: -0.75,
    },
    initial_hp: {
        asesino: 30,
        bardo: 23,
        druida: 23,
        clerigo: 23,
        mago: 21,
        paladin: 24,
        cazador: 8.75,
        guerrero: 9.75,
        pirata: 9.75,
        minero: 9.75,
        talador: 9.75,
        pescador: 9.75,
        recolector: 9.75,
        carpintero: 7.25,
        herrero: 7.25,
        sastre: 7.25,
    }

};

(function ($) {
    "use strict";

    $.fn.AoHpCalculator = function (options) {
        let targetParent = $(this);
        let initialized = false;
        let config = {};
        let defaults = {
            type: 'select',
        }
        const settings = $.extend({}, defaults, options);

        function initialize_config(config) {
            const class_names = Object.keys(config.class_avg);
            if (!class_names) {
                alert("There are not classes in config file");
                return false;
            }
            const hp_class = Object.keys(config.initial_hp);
            if (!hp_class) {
                alert("There are not classes in initial_hp key");
                return false;
            }
            const difference = class_names
                .filter(x => !hp_class.includes(x))
                .concat(hp_class.filter(x => !class_names.includes(x)));
            if (difference.length) {
                alert(`There are differences between \
                      initial_hp and class_names: ${difference}`);
                return false;
            }
            const races = Object.keys(config.race_avg)
            if (!races.length) {
                alert("There are not races loaded in race_avg");
                return false;
            }
            config.class_names = class_names;
            config.race_names = races;
            return true;
        }

        function render_buttons() {
            // Add classes:
            let $slc = $('<select>', {
                class: 'aohp-class-select form-select',
            });
            config.class_names.forEach((class_name) => {
                $slc.append(
                    $('<option>', {
                        value: class_name,
                        text: class_name,
                        class: 'aohp-class-opt',
                    })
                );
            });
            $('div.aohp-class-name').append($slc)
            let $slr = $('<select>', {
                class: 'aohp-race-select form-select',
            });
            config.race_names.forEach((race_name) => {
                $slr.append(
                    $('<option>', {
                        value: race_name,
                        text: race_name,
                        class: 'aohp-race-opt',
                    })
                );
            });
            $('div.aohp-race-name').append($slr)
        }

        function render_buttons_table() {
            const $table = $('<table>', {
                class: 'aohp-table-btn',
            })
            // Prepare data:


        }

        function get_input_data() {

        }

        function render() {
            if (settings.type == 'select') {
                render_buttons();
            } else if (settings.type == 'table') {
                render_buttons_table();
            }

            $('.aohp-calc').click(() => {
                const class_name = $('.aohp-class-select').val();
                const race_name = $('.aohp-race-select').val();
                debugger
                const lvl = parseInt($('#aohp-level').val());
                const hp = parseInt($('#aohp-hp').val());
                const hp_diff = calculate(class_name, race_name, lvl, hp);

                if (hp_diff > 0) {
                    $('.aohp-output').text(`Congratulations! \n Your character \
                        is ${hp_diff} HP above average`);
                } else if (hp_diff < 0) {
                    $('.aohp-output').text(`Ohh sorry! \n Your character \
                        is ${hp_diff} HP below average`);
                } else {
                    $('.aohp-output').text(`Good! \n Your character \
                        is on average. ${hp_diff} HP`);
                }

            })

        }

        function calculate(class_name, race_name, level, current_hp) {
            const mean_hp = ((
                config.class_avg[class_name] +
                config.race_avg[race_name]
            ) * (level - 1) + config.initial_hp[class_name])
            return current_hp - mean_hp;
        }

        debugger

        if (!initialized) {
            $('#load-ao-conf').change(function (event) {
                debugger;
                const file = this.files[0];
                const fr = new FileReader();
                fr.onload = () => {
                    const result = fr.result
                        .replace("data:", "")
                        .replace(/^.+,/, "");
                    let config_file = JSON.parse(atob(result));
                    if (initialize_config(config_file)) {
                        config = config_file;
                        $(this).css({ "display": "none" });
                        render();
                        $('.aohp-main').css({ "display": "block" });

                    } else {
                        this.value = null;
                    }
                }
                fr.readAsDataURL(file);
            })
            $('#load--default-ao-conf').click(function (event) {
                if (initialize_config(STANDAR_CONFIG)) {
                    config = STANDAR_CONFIG;
                };
            })
        } else {

        }

        targetParent.each(function () {

            return this;
        });
    };
})(jQuery);

$(document).ready(function () {
    $('#hp-calculator').AoHpCalculator({
        type: 'select',
    });
});
