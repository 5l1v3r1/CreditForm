window.onload = function () {
    var paymentWall = {} || paymentWall;

    (function (app) {
        var defaults = {
            url: 'https://api.paymentwall.com/api/payment-systems/',
            key: '7d364c80ef83409bb34e6035c8acf58f',
            country_code: '',
            container: 'paymentMethods'
        }

        var paymentMethods = [];
        var paymentMethod;
        var endPoint;
        var container = document.getElementById(defaults.container);
        var cardForm = document.getElementById('creditForm');
        var mainForm = document.getElementById('formCreditCard');
        var actionBtn = document.getElementById('validateCard');
        var cardHeader = document.getElementById('formHeader');
        var country = document.getElementById('selectCountry');

        function _setUrl(locale) {
            endPoint = defaults.url + '?key=' + defaults.key;
            if (locale) {
                defaults.country_code = locale;
                endPoint += '&country_code=' + defaults.country_code;
            }
            _getPaymentMethods();

        }

        function _getUrl() {
            if (!endPoint) {
                endPoint = defaults.url + '?key=' + defaults.key;
            }
            return endPoint;
        }

        country.addEventListener('change', function (e) {
            var locale = e.target.value;
            _setUrl(locale);
            mainForm.reset();
            _resetNotifications();

        });

        container.addEventListener('click', function (e) {
            var targetElement = e.target.closest("a");
            paymentMethod = targetElement.getAttribute('payment-method');
            if (!hasClass(cardForm, 'show')) {
                console.log(cardForm);
                addClass(cardForm, 'show');
                _renderCardHeader(paymentMethod);
                _renderPrice();
            }

        });

        actionBtn.addEventListener('click', function (e) {

            var cardHolder = document.getElementById('cardHolder'),
                cardHolderContainer = document.querySelector('.card-holder .notification'),
                cardNumber = document.getElementById('cardNumber'),
                cardNumberContainer = document.querySelector('.card-number .notification'),
                cardCvv = document.getElementById('cardCvv'),
                cardCvvContainer = document.querySelector('.card-cvv .notification');

            if (!cardHolder.validity.valid) {
                if (cardHolder.validity.valueMissing) {
                    _notifyError(cardHolderContainer, 'Please enter the card holder name !');
                }
                if (cardHolder.validity.patternMismatch) {
                    _notifyError(cardHolderContainer, 'Please enter only charecters ,ranging from 5 to 15 charecters !');
                }
            } else {
                _notifyError(cardHolderContainer, 'Valid Name !')
            }

            if (!cardNumber.validity.valid) {

                if (cardNumber.validity.valueMissing) {
                    _notifyError(cardNumberContainer, 'Please provide your card details !');
                }
                if (cardNumber.validity.patternMismatch) {
                    _notifyError(cardNumberContainer, 'Please enter valid card number !');
                }
            }

            if (!cardCvv.validity.valid) {
                if (cardCvv.validity.valueMissing) {
                    _notifyError(cardCvvContainer, 'Please enter CVV !');
                }
                if (cardCvv.validity.patternMismatch) {

                    _notifyError(cardCvvContainer, 'Please enter valid CVV !');
                }
            }
            e.preventDefault();
            if (cardNumber.value) {
                var isValidCard = validate_credit_card(cardNumber.value);
                (isValidCard) ? _notifyError(cardNumberContainer, 'Valid Card !'): _notifyError(cardNumberContainer, 'Invalid Card Details!');
                if (!isValidCard) {
                    if (!hasClass(cardNumber, 'error')) {
                        addClass(cardNumber, 'error')
                    }
                } else {
                    removeClass(cardNumber, 'error')

                }
            }
            if (cardCvv.value) {
                var isValidCvv = validateCVV(cardCvv.value);
                if (!isValidCvv) {
                    _notifyError(cardCvvContainer, "Invalid CVV");
                    if (!hasClass(cardCvv, 'error')) {
                        addClass(cardCvv, 'error')
                    }
                } else {
                    _notifyError(cardCvvContainer, "Valid CVV");
                    removeClass(cardCvv, 'error')

                }

            }
        });


        function _resetNotifications() {
            var notification = document.querySelectorAll('.notification');
            for (var i = 0; i < notification.length; i++) {
                notification[i].innerHTML = '';
            }
        }

        function _notifyError(el, htmlString) {
            el.innerHTML = htmlString;
        }

        function _getPaymentMethods() {
            var request = new XMLHttpRequest();
            request.open('GET', _getUrl(), true);

            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    paymentMethods = JSON.parse(request.response);
                    if (paymentMethods) {
                        _renderpaymentMethods();
                    }
                } else {
                    alert("Server Error ! Please try again !");
                }
            };

            request.onerror = function () {
                alert("connection Error ! Please try again !");
            };

            request.send();
        }

        

        function _getPaymentMethod() {
            return paymentMethod;
        }


        function _renderpaymentMethods() {
            var elements = '';
            for (var i = 0; i < paymentMethods.length; i++) {
                elements += '<a href="#" payment-method=' + paymentMethods[i].name + '><img src=' + paymentMethods[i].img_url + '><span>' + paymentMethods[i].name + '</span></a>';
            }
            container.innerHTML = elements;
            if (!hasClass(cardForm, 'show')) {
                removeClass(cardForm, 'show');

            }
        }

        function _renderCardHeader(method) {
            cardHeader.innerHTML = '<h4 class="title">' + method + '</h4>';
        }

        function _renderPrice() {
            actionBtn.innerHTML = '<a href="#">Pay ' + app.amount + '</a>';
        }

        function validate_credit_card(value) {
           if (/[^0-9-\s]+/.test(value)) return false;
           var nCheck = 0,
                nDigit = 0,
                bEven = false;
            value = value.replace(/\D/g, "");
            for (var n = value.length - 1; n >= 0; n--) {
                var cDigit = value.charAt(n),
                    nDigit = parseInt(cDigit, 10);
                if (bEven) {
                    if ((nDigit *= 2) > 9) nDigit -= 9;
                }
                nCheck += nDigit;
                bEven = !bEven;
            }
            return (nCheck % 10) == 0;
        }

        function validateCVV(cvv) {
            return (cvv === "123") ? false : true;
        }

        function addClass(el, className) {
            if (el.classList)
                el.classList.add(className);
            else
                el.className += ' ' + className;
        }

        function hasClass(el, className) {
            if (el.classList)
                el.classList.contains(className);
            else
                new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }

        function removeClass(el, className) {
            if (el.classList)
                el.classList.remove(className);
            else
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }

        app.init = function (amount) {
            app.amount = amount;
            _getPaymentMethods();
        }

    })(paymentWall);

    paymentWall.init("989");
    
}