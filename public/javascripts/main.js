$( document ).ready(function() {
    
    let inputSearch = $('#inputSearch');
    let inputMultibleCols = $('table > tbody > tr#rowForInput > td');
    let inputMultipleSearch = inputMultibleCols.find('input');
    let selectMultipleSearch = inputMultibleCols.find('select');
    let paramsObj = {};

    const setParamsObj = function (el) {
        let k = el.attr('id')
        let v = el.val();
        if(k === 'name') {
            let splitedValue = v.split(' ');
            paramsObj['first_name'] = splitedValue[0];
            if (splitedValue.length > 1) {
                paramsObj['last_name'] = splitedValue.splice(1, splitedValue.length).join(' ');
            } 
        } else if(k === 'gender' || k === 'marital_status') {
            paramsObj[k] = '{exact}' + v
        } else if(k === 'email' || k === 'phone') {
            paramsObj['contact.' + k] = v;
        }else {
            paramsObj[k] = v
        }
    }

    const ajaxSearch = function(urlArgs) {
        let url = typeof urlArgs === 'string' || urlArgs instanceof String ? ('search-multiple?' + urlArgs) : ('search?q=' + inputSearch.val())
        $('.fa-spinner').removeClass('d-none');
        $('.table > tbody tr').not(":nth-child(1)").fadeOut('fast');
        $.get(url)
            .done(function(newList) {
                console.log( "second success" );
                $('.table > tbody > tr:gt(0)').remove();
                $('.table > tbody').append(newList);
            })
            .fail(function() {
                console.log( "error" );
            })
            .always(function() {
                console.log( "finished" );
                $('.table > tbody > tr').not(":nth-child(1)").fadeIn('fast');
                $('.fa-spinner').addClass('d-none');
            });
    }

    inputSearch.on('keyup', _.debounce(ajaxSearch, 500, {
        'leading': false,
        'trailing': true
    }));


    $('#multiSearch').click(function(e){
        if( $(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }

        if ($('#rowForInput').hasClass('d-none') ) {
            $('#rowForInput').removeClass('d-none');
        } else {
            $('#rowForInput').addClass('d-none')
        }
        
    });

    $('#clearInput').click(function(e){
        inputMultipleSearch.val('');
        selectMultipleSearch.val('');
        paramsObj = {};
        sendAjax();
    })

    const sendAjax = function() {
        const args = $.param(paramsObj);
        ajaxSearch(args);
    }

    
    selectMultipleSearch.change(function(e) {
        setParamsObj($(this));
        sendAjax();  
    })

    inputMultipleSearch.blur(function(e) {
        setParamsObj($(this));
        sendAjax();
    })

    $('#addCustomerBtn').click(function(e){
        window.location = '/customer/create';
    })

    $('#clearSelectedItem').click(function() {
        $('table > tbody > tr').removeClass('selected');
        $('#multiSearch').removeClass('d-none');
        $('#deleteSelectedItem').addClass('d-none');
        $(this).addClass('d-none');
    });

    $('#deleteSelectedItem').click(function() {
        let customerId = $(this).data('customerId');
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6CC3D5',
            cancelButtonColor: '#FFC900',
            confirmButtonText: 'Yes, delete it!',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                let url = '/customer/' + customerId + '/delete'
                return new Promise((resolve) => {
                    $.post( url, function( message ) {
                        resolve(message);
                    });
                })
              },
          }).then((result) => {
              console.log(result)
            if (result.value === 'success') {
              swal(
                'Deleted!',
                'customer has been deleted.',
                'success'
              )
              $('#deleteSelectedItem').removeAttr('data');
              $('#deleteSelectedItem').addClass('d-none');
              $('#clearSelectedItem').addClass('d-none');
              $('#multiSearch').removeClass('d-none');

              sendAjax();
            }
          })
    })

    $("table > tbody").on("click","tr:not(:first-child)", function(){
        console.log('row is clicked');
        let customerRow = $('table > tbody > tr');
        let customerId = $(this).data('customer-id');
        if($(this).hasClass('selected')) {
            console.log('redirect to customer view')
            window.location = 'customer/' + customerId + '/update';
        } else {
            customerRow.removeClass('selected');
            $(this).addClass('selected');
            $('#deleteSelectedItem').data('customerId', customerId);
            if($('#deleteSelectedItem').hasClass('d-none')) {
                $('#deleteSelectedItem').removeClass('d-none');
                $('#clearSelectedItem').removeClass('d-none');
                $('#multiSearch').addClass('d-none');
            } 
        }
    });

});