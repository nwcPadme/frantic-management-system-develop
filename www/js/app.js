angular.module("frantic_management_system", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","frantic_management_system.controllers", "frantic_management_system.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Frantic Management System" ;
		$rootScope.appLogo = "data/images/content/transparent.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_main_f = false ;
		$rootScope.hide_menu_dashboard_page = false ;
		$rootScope.hide_menu_mailbox = false ;
		$rootScope.hide_menu_filemanager = false ;
		$rootScope.hide_menu_projects = false ;
		$rootScope.hide_menu_bugs = false ;
		$rootScope.hide_menu_manage_invoice = false ;
		$rootScope.hide_menu_all_payments = false ;
		$rootScope.hide_menu_estimates = false ;
		$rootScope.hide_menu_proposals = false ;
		$rootScope.hide_menu_tickets = false ;
		$rootScope.hide_menu_quotations = false ;
		$rootScope.hide_menu_other = false ;
		$rootScope.hide_menu_faqs = false ;
		$rootScope.hide_menu_rate_this_app = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "frantic_management_system",
				storeName : "frantic_management_system",
				description : "The offline datastore for Frantic Management System app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}

			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("frantic_management_system.welcome_");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?mad\-agency\.xyz/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?frantic\-managers\.mad\-agency\.xyz/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("frantic_management_system",{
		url: "/frantic_management_system",
			abstract: true,
			templateUrl: "templates/frantic_management_system-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("frantic_management_system.about_us", {
		url: "/about_us",
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.all_payments", {
		url: "/all_payments",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-all_payments.html",
						controller: "all_paymentsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.bugs", {
		url: "/bugs",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-bugs.html",
						controller: "bugsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.contact_us", {
		url: "/contact_us",
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-contact_us.html",
						controller: "contact_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.dashboard", {
		url: "/dashboard",
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.dashboard_page", {
		url: "/dashboard_page",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-dashboard_page.html",
						controller: "dashboard_pageCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.estimates", {
		url: "/estimates",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-estimates.html",
						controller: "estimatesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.faqs", {
		url: "/faqs",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.filemanager", {
		url: "/filemanager",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-filemanager.html",
						controller: "filemanagerCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.form_contact_us", {
		url: "/form_contact_us",
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-form_contact_us.html",
						controller: "form_contact_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.mailbox", {
		url: "/mailbox",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-mailbox.html",
						controller: "mailboxCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.main", {
		url: "/main",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-main.html",
						controller: "mainCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.manage_invoice", {
		url: "/manage_invoice",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-manage_invoice.html",
						controller: "manage_invoiceCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.projects", {
		url: "/projects",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-projects.html",
						controller: "projectsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.proposals", {
		url: "/proposals",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-proposals.html",
						controller: "proposalsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.quotations", {
		url: "/quotations",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-quotations.html",
						controller: "quotationsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.registration_", {
		url: "/registration_",
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-registration_.html",
						controller: "registration_Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.tickets", {
		url: "/tickets",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-tickets.html",
						controller: "ticketsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_management_system.welcome_", {
		url: "/welcome_",
		cache:false,
		views: {
			"frantic_management_system-side_menus" : {
						templateUrl:"templates/frantic_management_system-welcome_.html",
						controller: "welcome_Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/frantic_management_system/welcome_");
});
