var Name = ['あるぱか','いぬ','ねこ','ぺんぎん'];
var Kaze = [0, 1, 2, 3]; //東、南、西、北
var KtoS = { 0: "東", 1: "南", 2: "西", 3: "北" };
var ribo = 0;
var prev = [-1, 0, 1, 0, 25000, 25000, 25000, 25000, 0, 1, 2, 3, 1000];
var now  = [1, 0, 1, 0, 25000, 25000, 25000, 25000, 0, 1, 2, 3, 0];
var next = [-1, 0, 1, 0, 25000, 25000, 25000, 25000, 0, 1, 2, 3, 1000];
var BAFU = 1; var KYOKU = 2; HONBA = 3;
var POINT = 4; var KAZE = 8; var RIBO = 12;

/*
ToDo list
    1. undo
*/

// menu
jQuery( function($) {
    function setName() {
        $('.one-name').each( function() {
            $(this).text( Name[0] );
        });
        $('.two-name').each( function() {
            $(this).text( Name[1] );
        })
        $('.three-name').each( function() {
            $(this).text( Name[2] );
        })
        $('.four-name').each( function() {
            $(this).text( Name[3] );
        });
    }
    
    function setKaze() {
        $('#one-kaze').text( KtoS[Kaze[0]] );
        $('#two-kaze').text( KtoS[Kaze[1]] );
        $('#three-kaze').text( KtoS[Kaze[2]] );
        $('#four-kaze').text( KtoS[Kaze[3]] );
    }

    $('#name-change form').submit( function() {
        var i = 0;
        $('#name-change [name="nc"]').each( function() {
            Name[i] = $(this).val();
            i++;
        })
        setName();
        $('#name-change').dialog('destroy');
        return false;
    })

    $('#oya-change form').submit( function() {
        var oya = $('#oya-change [name="oc"]:checked').val()-'0';
        for( var i=0; i<4; i++ ) {
            Kaze[(oya+i)%4] = i;
        }
        setKaze();
        $('#oya-change').dialog('destroy');
        return false;
    })

    $('#initialize form').submit( function() {
        Kaze = [0, 1, 2, 3];
        setKaze();
        $('#one .p2').text(25000);
        $('#two .p2').text(25000);
        $('#three .p2').text(25000);
        $('#four .p2').text(25000);
        $('#center #bafu').text( "東" );
        $('#center #kyoku').text( 1 );
        $('#center #honba').text( 0 );
        prev = now;
        now = [1, 0, 1, 0, 25000, 25000, 25000, 25000, 0, 1, 2, 3, 0];
        next[0] = -1;
        $('#initialize').dialog('destroy');
        return false;
    })

    function disp_nameChange() {
        $('#name-change').dialog({
            title: "名前を書いてね",
            modal: true,
            height: 'auto',
            width : 400,
            position : {
                of : '#parent'
            },
        });
    }

    function disp_oyaChange() {
        $('#oya-change').dialog({
            title: "親を選んで！",
            modal: true,
            height: 'auto',
            width : 400,
            position : {
                of : '#parent'
            },
        });
    }

    function disp_initialize() {
        $('#initialize').dialog({
            title: "対局初めの状態にするよ",
            modal: true,
            height: 'auto',
            width : 400,
            position : {
                of : '#parent'
            },
        });
    }

    $('#menu1').click( function() {
        var k = $(this).val();
        if( k != 0 ) {
            if( k == 1 ) {
                disp_nameChange();
            }
            else if( k == 2 ) {
                disp_oyaChange();
            }
            else if( k == 3 ) {
                disp_initialize();
            }
            $('#menu1').val(0);
        }
    })
});

// undo redo
jQuery( function($) {
    function setState( state ) {
        $('#center #bafu').text( KtoS[state[1]] );
        $('#center #kyoku').text( state[2] );
        $('#center #honba').text( state[3] );
        $('#one .p2').text( state[4] );
        $('#two .p2').text( state[5] );
        $('#three .p2').text( state[6] );
        $('#four .p2').text( state[7] );
        Kaze = [ state[8], state[9], state[10], state[11] ];
        $('#one-kaze').text( KtoS[state[8]] );
        $('#two-kaze').text( KtoS[state[9]] );
        $('#three-kaze').text( KtoS[state[10]] );
        $('#four-kaze').text( KtoS[state[11]] );
        ribo = state[12];
    }

    function undo() {
        if( prev[0] < 0 ) {
            alert('これ以上戻れないー'); return;
        }
        setState(prev);
        next = now.concat();
        now = prev.concat();
        prev[0] = -1;
    }
    
    function redo() {
        if( next[0] < 0 ) {
            alert('これ以上進めないー'); return;
        }
        setState(next);
        prev = now.concat();
        now = next.concat();
        next[0] = -1;
    }

    $('#undo-redo #undo').click(undo);
    $('#undo-redo #redo').click(redo);
})


// agari dialogの表示
jQuery( function($) {
    function disp_dialog1() {
        $('#agari').dialog({
            title: "あがりおめでとう！",
            modal: true,
            height: 'auto',
            width : 400,
            position : {
                of : '#parent'
            },
        });
    }
    $('#show1').click(disp_dialog1);
    
    var radio1 = -1, radio2 = -1;
    $('#agari [name="cb1"]').click( function() {
        if( $(this).val() == radio1 ) {
            $(this).prop( 'checked', false );
            radio1 = -1;
        }
        else {
            radio1 = $(this).val();
        }
    });
    $('#agari [name="cb2"]').click( function() {
        if( $(this).val() == radio2 ) {
            $(this).prop( 'checked', false );
            radio2 = -1;
        }
        else {
            radio2 = $(this).val();
        }
    });
});


// ryukyoku dialogの表示
jQuery( function($) {
    function disp_dialog2() {
        $('#ryukyoku').dialog({
            title: "流局だぁ",
            modal: true,
            height: 'auto',
            width : 400,
            position : {
                of : '#parent'
            },
        });
    }
    $('#show2').click(disp_dialog2);
});


// あがり・流局をしたときの処理
jQuery( function($) {
    var oyaagari;
    var getpoints = [0, 0, 0]; // あがり点, 本場ボーナス, 供託棒
    var change = [0, 0, 0, 0];

    // 共通の関数
    function plus( no, x ) {
        change[no] += x;
        var point = now[POINT+no];
        point += x;
        now[POINT+no] = point;
    }

    function minus( no, x ) {
        change[no] -= x;
        var point = now[POINT+no];
        point -= x;
        now[POINT+no] = point;
    }

    function riichi( Form ) {
        var i = 0;
        Form.each( function() {
            if( $(this).prop('checked') ) {
                minus( i, 1000 );
                ribo += 1000;
            }
            i++;
        });
        now[RIBO] = ribo;
    }

    function moveKaze() {
        for( var i=0; i<4; i++ ) {
            Kaze[i] = (Kaze[i]+3)%4;
            now[KAZE+i] = Kaze[i];
        }
    }

    function moveCenter( no ) {
        // no=0: 子あがり no=1: 親あがり no=2 流局
        if( no == 0 ) {
            now[KYOKU]++;
            if( now[KYOKU] > 4 ) {
                now[BAFU] = ( now[BAFU]+1 )%4;
                now[KYOKU] = 1;
            }
            now[HONBA] = 0;
        }
        else if( no == 1 ) {
            now[HONBA]++;
        }
        else {
            now[KYOKU]++;
            if( now[KYOKU] > 4 ) {
                now[BAFU] = ( now[BAFU]+1 )%4;
                now[KYOKU] = 1;
            }
            now[HONBA]++;
        }
    }

    function refresh() {
        $('#center #bafu').text( KtoS[now[BAFU]] );
        $('#center #kyoku').text( now[KYOKU] );
        $('#center #honba').text( now[HONBA] );
        $('#one .p2').text( now[POINT+0] );
        $('#two .p2').text( now[POINT+1] );
        $('#three .p2').text( now[POINT+2] );
        $('#four .p2').text( now[POINT+3] );
        $('#one-kaze').text( KtoS[now[KAZE+0]] );
        $('#two-kaze').text( KtoS[now[KAZE+1]] );
        $('#three-kaze').text( KtoS[now[KAZE+2]]  );
        $('#four-kaze').text( KtoS[now[KAZE+3]] );
    }

    function dispPoint() {
        $('#result #1').text(getpoints[0]);
        $('#result #2').text(getpoints[1]);
        $('#result #3').text(getpoints[2]);
        for( var i=0; i<4; i++ ) {
            if( i == 0 ) var person = $('#result #point0');
            if( i == 1 ) var person = $('#result #point1');
            if( i == 2 ) var person = $('#result #point2');
            if( i == 3 ) var person = $('#result #point3');
            if( change[i] > 0 ) {
                person.text("+"+change[i]);
                person.css('color', 'red');
            }
            else {
                person.text(change[i]);
                person.css('color', 'blue');
            }
        }
        change = [0, 0, 0, 0];
        getpoints = [0, 0, 0];
    }

    // あがりのときの関数
    function pointPlus( x ) {
        x += getpoints[1] + getpoints[2];
        var s = $('#agari [name="cb1"]:checked').val() - '0';
        plus( s, x );
    }

    function pointMinus( x ) {
        if( $('#agari [name="cb2"]:checked').length == 0 ) {
            if( !oyaagari ) {
                for( var i=0; i<4; i++ ) {
                    if( Kaze[i] == 0 )
                        minus( i, x );
                }
            }
            x += 100 * now[HONBA];
            var s = $('#agari [name="cb1"]:checked').val() - '0';
            if( s != 0 ) minus( 0, x );
            if( s != 1 ) minus( 1, x );
            if( s != 2 ) minus( 2, x );
            if( s != 3 ) minus( 3, x );
        }
        else {
            x += 300 * now[HONBA];
            var t = $('#agari [name="cb2"]:checked').val() - '0';
            minus( t, x );
        }
    }

    function changePoint(han, fu) {
        if( oyaagari ) var point = 6;
        else var point = 4;
        point = point*fu*4;
        for( var i=0; i<han; i++) point *= 2;
        point = Math.ceil(point/100) * 100;
        if( (!oyaagari && point > 8000) || (oyaagari && point > 12000) ) {
            if( han >= 13 ) point = 32000;
            else if ( han >= 11 ) point = 24000;
            else if ( han >= 8 ) point = 16000;
            else if ( han >= 6 ) point = 12000;
            else point = 8000;
            if( oyaagari ) point = point*3/2;
        }
        var px = point; var py = 0;
        if( $('#agari [name="cb2"]:checked').length == 0 ) {
            if( oyaagari ) {
                px /= 3;
                px = Math.ceil(px/100) * 100;
                py = px;
                px *= 3;
            }
            else {
                px /= 4;
                px = Math.ceil(px/100) * 100;
                py = px;
                px *= 4;
            }
            getpoints[0] = px;
            getpoints[1] = 300 * now[HONBA];
            getpoints[2] = ribo;
        }
        else {
            py = px;
            getpoints[0] = px;
            getpoints[1] = 300 * now[HONBA];
            getpoints[2] = ribo;
        }
        ribo = 0;
        pointPlus( px );
        pointMinus( py );
    }

    function agari() {
        if( $('#agari [name="cb1"]:checked').length == 0 ) {
            alert('あがりの人を選んでね'); return;
        }
        var s = $('#agari [name="cb1"]:checked').val() - '0';
        if( s == $('#agari [name="cb2"]:checked').val() - '0' ) {
            alert('あがった人とふりこんだ人が同じだよ'); return;
        }

        var han = $('#agari [name="han"]').val() - '0';
        var fu = $('#agari [name="fu"]').val() - '0';
        if( (han < 1 || han > 13) || fu < 20 || (fu != 25 && fu%10 != 0) ) {
            alert('飜と符は正しい？'); return;
        }

        prev = now.concat();
        next[0] = -1;

        if( Kaze[s] == 0 ) oyaagari = true;
        else oyaagari = false;
        riichi($('#agari [name="cb3"]'));
        changePoint( han, fu );

        if( !oyaagari ) {
            moveKaze();
            moveCenter(0);
        }
        else {
            moveCenter(1);
        }
    }

    $('#agari form').submit( function() {
        agari();
        refresh();
        dispPoint();
        $('#agari').dialog('destroy');
        $('#result').dialog({
            title: "この点数だ！！",
            position : {
                of : '#parent'
            },
            show: 'explode',
            hide: 'explode',
        });
        return false;
    });

    // 流局のときの関数
    function tempai() {
        prev = now.concat();
        next[0] = -1;
        var x, y;
        switch( $('#ryukyoku [name="cb1"]:checked').length ) {
            case 0:
                moveKaze();
                moveCenter(2);
                return;
            case 1:
                x = 3000; y = 1000;
                break;
            case 2:
                x = 1500; y = 1500;
                break;
            case 3:
                x = 1000; y = 3000;
                break;
            default:
                moveCenter(1);
                return;
        }
        oyaagari = false;
        var i = 0;
        var Form = $('#ryukyoku [name="cb1"]' );
        Form.each( function() {
            if( $(this).prop('checked') ) {
                plus( i, x );
                if( Kaze[i] == 0 ) oyaagari = true;
            }
            else
                minus( i, y );
            i++;
        });
        if( !oyaagari ) {
            moveKaze();
            moveCenter(2);
        }
        else {
            moveCenter(1);
        }
    }

    $('#ryukyoku form').submit( function() {
        tempai();
        riichi( $('#ryukyoku [name="cb2"]') );
        refresh();
        dispPoint();
        $('#ryukyoku').dialog('destroy');
        $('#result').dialog({
            title: "流局の点数移動",
            position : {
                of : '#parent'
            },
            show: 'explode',
            hide: 'explode',
        });
        return false;
    });
});