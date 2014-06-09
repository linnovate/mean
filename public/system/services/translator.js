'use strict';

var messages = {
    it:{
        header:{
            register:'Registrati',
            signin : 'Login'
        }
    },
    en:{
        msg:{
            yes:'Yes',
            no:'No'
        },
        header:{
            register:'Register',
            signin : 'Sign In',
            logout : 'Logout'
        },
        auth:{
            register:{
                btn:'Register',
                header:'Register',
                name:{
                    placeholder:'Full name'
                },
                email:{
                    placeholder:'Email'
                },
                username:{
                    placeholder:'Username'
                },
                password:{
                    placeholder:'Password'
                },
                repassword:{
                    placeholder:'Retype password'
                }
            },
            signin:{
                btn:'Sign In',
                header:'Sign In',
                email:{
                    placeholder:'Email'
                },
                password:{
                    placeholder:'Password'
                }
            }
        },
        article:{
            form:{
                btn:'Submit',
                header:'Add article',
                choose:'Upload Image',
                drag:'or drag photos here',
                nohtml5:'HTML5 Drop File is not supported on this browser',
                placeholder:{
                    title:'Title',
                    description:'Description',
                    price:'Price',
                    categories:'Enter categories here (at least one)'
                }
            },
            headers:{
                pic:'Pic',
                title:'Title',
                description:'Description',
                price:'Price',
                categories:'Categories',
                actions:'Actions'
            },
            labels:{
                add:'New',
                edit:'Edit',
                del:'Delete'
            },
            msg :{
                dlt: 'Are you sure you want to delete this article?'
            }
        }
    }
};

angular.module('mean.system')
    .config(['$translateProvider',function($translateProvider) {
        $translateProvider.translations('en', messages['en']);
        $translateProvider.preferredLanguage('en');
    }]);