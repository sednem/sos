'use strict';

/* Global Object */
var geo = new google.maps.Geocoder;

/* Controllers */
var SoSCtrls = angular.module('sosWeb.controllers', ['ui.bootstrap','ui.map','ui.event']);

/* Main page Ctrl */
SoSCtrls.controller('MainCtrl', ['$scope', '$route', '$http', '$location', '$modal',
	'Alerts', 'ServiceTpServico', 'ServicePrestadores',  'Authentication', '$log', 'Dialog',
function($scope, $route, $http, $location, $modal, Alerts, ServiceTpServico,
	ServicePrestadores, Authentication, $log, Dialog) {

	$scope.gPlace;
	$scope.tipoServico;
	$scope.endereco;
	$scope.raio;
	$scope.user = Authentication.currentUser();
	$scope.prestador = {
		email: '',
		cpf: '',
		telefone: '',
		logradouro: '',
		numero: 0,
		complemento: '',
		cep: '',
		cidade: '',
		estado: ''
	};
	
	$scope.servico = {
		descricao: '',
		valor: 0.0,
		nome_tipo_servico: '',
		usuario_email: ''
	};
	

	$scope.search = function() {
		if ($scope.tipoServico != null && $scope.tipoServico != '' &&
			$scope.endereco != null && $scope.endereco != '' &&
			$scope.raio != null && $scope.raio != '') {
			$location.path(
				'/busca/tipoServico/'+$scope.tipoServico+
				'/endereco/'+$scope.endereco+
				'/raio/'+$scope.raio);
		} else {
			Alerts.add('Preencha as informações da busca!', 'warning');
		}
	};
	
	$scope.openPrestadorAnuncios = function() {
		$location.path('/prest/email/'+$scope.user.email+
				'/apiKey/'+$scope.user.apiKey);
	};
	
	$scope.openDetalhesPrestador = function(strEmail) {
		$location.path('/prestador/'+$scope.user.email);
	};

	$scope.tiposServicos = new Array();
	ServiceTpServico.getTiposServicos().then(
		function(data) { $scope.tiposServicos = data; }
	);

	$scope.labels = {
		"filtrar_resultado": "Filtrar prestadores...",
		"prestadores_encontrados": "Prestadores encontrados",
		"endereco": "Endereço",
		"buscar": "Buscar",
	};

	$scope.openAnuncio = function () {
		if($scope.user.logado){
			ServicePrestadores.getPrestador($scope.user.email,
				function(data) {
					if (data.cpf != data.email) {
						$scope.openCadastroAnuncio();
					} else {
						$scope.openCadastroPrestador();
					}
			});
		}else{
			$scope.openLogin(true);
		}
	};
	
	$scope.openLogin = function (fromAnuncio) {
		var modalInstance;
		$route.reload();
		modalInstance = $modal.open({
			  templateUrl: 'partials/login.html',
			  controller: 'LoginCtrl',
			  resolve: {
				user: function () {
				  return $scope.user;
				}
			  }
		});
		modalInstance.result.then(function(data) {
			if (data != '') {
				$scope.user = Authentication.currentUser();
				$scope.user.logado = true;
				$scope.user.senha='';
				$scope.user.apiKey = data.apiKey;
				$scope.user.nome = data.usuario.nome;
				$scope.user.facebookId = data.usuario.facebookId;
				Authentication.login($scope.user);
				//Alerts.closeAll();
				$scope.$apply();
				if (fromAnuncio) {
					$scope.openAnuncio();
				}
				
			}
		}, function() {
		});
	};
	
	$scope.logout = function () {
		Dialog.waitDialogOpen();
		$http({
			method : 'DELETE',
			url : 'http://soservices.vsnepomuceno.cloudbees.net/token/logout/'+$scope.user.email,
			data : $scope.user,
			headers: {'Content-Type': 'application/json'}
		}).
		success(function(data, status, headers, config) {
			$scope.user.nome='';
			$scope.user.email='';
			$scope.user.senha='';
			$scope.user.logado = false;
			$scope.user.apiKey = '';
			$scope.user.id = '';
			Authentication.logout($scope.user);
			Dialog.waitDialogClose();
			$scope.$apply();
			$location.path('/home');

		}).error(function(data, status, headers, config) {
			Alerts.add('Erro: ' + status + ' ' + data, 'danger');
			Dialog.waitDialogClose();
		});	  
	};
	
	$scope.openCadastro = function () {
		var modalInstance;
		modalInstance = $modal.open({
			  templateUrl: 'partials/cadastrarUsuario.html',
			  controller: 'cadastrarCtrl',
			  resolve: {
				user: function () {
				  return $scope.user;
				}
			  }
		});
		modalInstance.result.then(function(data) {
			if (data != '') {
				$scope.user.logado = true;
				$scope.user.senha='';
				$scope.user.confirmarsenha='';
				$scope.user.apiKey = data.apiKey;
				$scope.user.nome = data.usuario.nome;
				$scope.user.facebookId = data.usuario.facebookId;
				Authentication.login($scope.user);
				//Alerts.closeAll();
				$scope.$apply();
				Alerts.add('Usuário cadastrado com sucesso!', 'success');
				
			}
		}, function() {
		});
	};
	
	$scope.openCadastroPrestador = function () {
		var modalInstance;
		modalInstance = $modal.open({
			templateUrl: 'partials/cadastrarPrestador.html',
			controller: 'cadastroPrestadorCtrl',
			resolve: {
				prestador: function () {
					$scope.prestador.email = $scope.user.email;
					return $scope.prestador;
				},
				apiKey: function () {
					return $scope.user.apiKey;
				}				
			}
		});	
		modalInstance.result.then(function () {
			Alerts.add('Prestador cadastrado com sucesso!', 'success');
			$scope.openCadastroAnuncio();
		}, 
		function () {
		});
	};
	
	$scope.openCadastroAnuncio = function () {
		var modalInstance;
		modalInstance = $modal.open({
			  templateUrl: 'partials/anunciar.html',
			  controller: 'anuncioCtrl',
			  resolve: {
				servico: function () {
					$scope.servico.usuario_email = $scope.user.email;
					return $scope.servico;
				},
				tiposServicos: function () {
					return $scope.tiposServicos;
				},
				apiKey: function () {
					return $scope.user.apiKey;
				}
			  }
			});
			modalInstance.result.then(function () {
				$route.reload();
				Alerts.add('Anuncio cadastrado com sucesso!', 'success');
			}, 
			function () {

		});
	};
	
	$scope.removePrest = function () {
		var modalInstance;
		modalInstance = $modal.open({
			  templateUrl: 'partials/confirmDialog.html',
			  controller: 'confirmCtrl',
			  resolve: {				
			  }
			});
			modalInstance.result.then(function () {
				$http({
					method : 'DELETE',
					url : 'http://soservices.vsnepomuceno.cloudbees.net/prestador?email='+ $scope.user.email,
					data : $scope.user,
					headers: {'Content-Type': 'application/json', 
								'token-api': $scope.user.apiKey}
				}).
				success(function(data, status, headers, config) {
					$scope.user.nome='';
					$scope.user.email='';
					$scope.user.senha='';
					$scope.user.logado = false;
					$scope.user.apiKey = '';
					Authentication.logout($scope.user);
					$scope.$apply();
					$location.path('/home');

				}).error(function(data, status, headers, config) {
					Alerts.add('Erro: ' + status + ' ' + data, 'danger');
				});  
			}, 
			function () {	});		
	};
	
	$scope.editPrest = function () {

		ServicePrestadores.getPrestador($scope.user.email,
				function(data) {
					if (data.cpf != data.email) {
						$scope.openEditPrestador(data);
					} else {
						Alerts.add('Você ainda não é um prestador, cadastre um anúncio!', 'warning');
					}
			});
	};
	
	$scope.openEditPrestador = function (data) {
		var modalInstance;
		modalInstance = $modal.open({
			templateUrl: 'partials/cadastrarPrestador.html',
			  controller: 'editPrestadorCtrl',
			  resolve: {
					prestador: function () {
						$scope.prestador.email = $scope.user.email;
						$scope.prestador.cpf = data.cpf;
						$scope.prestador.telefone = data.telefone;
						$scope.prestador.logradouro = data.endereco.logradouro;
						$scope.prestador.numero = data.endereco.numero;
						$scope.prestador.complemento = data.endereco.complemento;
						$scope.prestador.cep = data.endereco.cep;
						$scope.prestador.cidade = data.endereco.cidade;
						$scope.prestador.estado = data.endereco.estado;
						return $scope.prestador;
					},
					apiKey: function () {
						return $scope.user.apiKey;
					}
					
			  }
			});
			modalInstance.result.then(function () {
				Alerts.add('Prestador atualizado com sucesso!', 'success');
			}, 
			function () {

		});
	};
	
	$scope.atualizarSenha = function () {
		var modalInstance;
		modalInstance = $modal.open({
			templateUrl: 'partials/atualizarSenha.html',
			controller: 'atualizarSenhaCtrl',
			resolve: {				   
				apiKey: function () {
					return $scope.user.apiKey;
				},
				email: function () {
					return $scope.user.email;
				}
			}
			});
			modalInstance.result.then(function () {
				Alerts.add('Senha atualizada com sucesso!', 'success');
			}, 
			function () {

		});
	};
 	
 	$scope.avaliacoes = function () {
 		$http({
 			method: 'GET',
 			url: 'http://soservices.vsnepomuceno.cloudbees.net/prestador/email?email='+$scope.user.email}).
 			success(function(data, status, headers, config, prest) {
 				if (data.cpf != data.email) {
 					$location.path('/avaliacoesPrest/email/'+$scope.user.email+
 							'/apiKey/'+$scope.user.apiKey);
 				} else {
 					Alerts.add('Você ainda não é um prestador, cadastre um anúncio!', 'warning');
 				}
 			}).
 			error(function(data, status, headers, config) {		
 				Alerts.add('Erro: ' + status +' '+ data, 'danger');
 			});	
 	};
}]);

/* Ctrl Busca de prestadores */
SoSCtrls.controller('PrestadoresCtrl', ['$scope', '$location', '$routeParams',
	'$modal', 'Alerts', 'ServicePrestadores', 'ServiceTpServico', 'Dialog',
	function($scope, $location, $routeParams, $modal, Alerts, ServicePrestadores, ServiceTpServico, Dialog) {

	 	$scope.tipoServico = $routeParams.tipoServico;
		$scope.endereco = $routeParams.endereco;
		$scope.raio = $routeParams.raio;

		$scope.servicos = [];

		$scope.maxRate = 5;

		//Filter and order
		$scope.orderProp = 'prestador.distancia';
		$scope.orderBy = function (orderProp) {
			$scope.orderProp = orderProp;
		};

		//Inicializa o mapa
		$scope.userLocation;
		var ll = new google.maps.LatLng(-7.9712137, -34.839565100000016);
		$scope.mapOptions = {
			center: ll,
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		$scope.getPesquisadores = function() {
			
			if ($scope.tipoServico != null && $scope.tipoServico != '' &&
					$scope.endereco != null && $scope.endereco != '' &&
					$scope.raio != null && $scope.raio != '') {
				
				Dialog.waitDialogOpen();
				geo.geocode({'address':$scope.endereco},function(results, status){
				  	if (status == google.maps.GeocoderStatus.OK) {
						$scope.userLocation = results[0].geometry.location;
						ll = new google.maps.LatLng($scope.userLocation.lat(), $scope.userLocation.lng());
						
						//Recupera o ID do tipo de servico
						ServiceTpServico.getIdByName($scope.tipoServico).then(
							function(idTpServico) { 
								//Busca os prestadores de servicos
								ServicePrestadores.getServicos(
									idTpServico, //Encontrar maneira de trocar nome para id
									$scope.userLocation.lat(), 
									$scope.userLocation.lng(),
									($scope.raio * 1000), //API esta em metros e nao KM.
									function(data) {
										$scope.servicos = data;
										Dialog.waitDialogClose();
										$scope.carregarMapa(ll);
									}
								);
							}
						);
				  	} else {
				  		Alerts.add(
				  			"Geocode was not successful for the following reason: " + status, 'danger');
				  	}
				});
			} else {
				Alerts.add('Preencha as informações da busca!', 'warning');
			}
		};

		$scope.carregarMapa = function(center) {
			//Remove old markers
			angular.forEach($scope.myMarkers, function(marker) {
				marker.setMap(null);
			});

			$scope.myMarkers = new Array();
			//Adiciona marcadores para cada prestador encontrado
			var i;
			for (i = 0; i < $scope.servicos.length; ++i) {
				var newMarker = 
					$scope.myMarkers.push(
						new google.maps.Marker({
							map: $scope.sosMap,
							position: new google.maps.LatLng(
								$scope.servicos[i].prestador.endereco.latitude,
								$scope.servicos[i].prestador.endereco.longitude),
							icon: 'img/map_icon_prest.png',
							servico: $scope.servicos[i]
						})
					);
				$scope.servicos[i].markerIndex = i;
			}

			$scope.myMarkers.push(
				new google.maps.Marker({
					map: $scope.sosMap,
					position: center
				})
			);

			$scope.sosMap.panTo(center); //Centraliza o mapa no endereÃ§o informado.

		}

		$scope.openMarkerInfo = function(marker) {
			$scope.currentMarker = marker;
			$scope.currentMarkerIsService = (typeof $scope.currentMarker.servico !== 'undefined');
			$scope.myInfoWindow.open($scope.sosMap, marker);
		};

		$scope.exibirDetalhesServico = function(servico){
			$location.path('/servico/'+servico.id);
		}

		//TODO refatorar duplicação de método
		$scope.exibirAvaliacoes= function(servico){
			var modalInstance;

			Dialog.waitDialogOpen();
			ServicePrestadores.getAvaliacoes(servico.prestador.email,
				function(data) {
					$scope.avaliacoes = data;
					Dialog.waitDialogClose();

					modalInstance = $modal.open({
						  templateUrl: 'partials/avaliacoes.html',
						  controller: 'AvaliacoesCtrl',
						  resolve: {				
							avaliacoes: function () {
							  return $scope.avaliacoes;
							}
						  }
					});
				}
			);
		};

		if($scope.tipoServico && $scope.endereco && $scope.raio){
			$scope.getPesquisadores();
		}
	}
]);

//Controler Servico
SoSCtrls.controller('ServicoCtrl', ['$scope', '$routeParams', '$modal', 'Alerts',
	'ServiceServicos', 'ServiceForum', 'ServicePrestadores', 'Dialog',
	function($scope, $routeParams, $modal, Alerts,
		ServiceServicos, ServiceForum, ServicePrestadores, Dialog) {
		$scope.idServico = $routeParams.idServico;
		$scope.servico = [];
		$scope.posts = [];
		$scope.pergunta = '';
		$scope.mensagem = '';
		$scope.mensagemWarn = false;

		$scope.mapOptions = {
			center: new google.maps.LatLng(
				-7.9712137, -34.839565100000016),
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		Dialog.waitDialogOpen();
		ServiceServicos.getServico($scope.idServico,
			function(data) {
				$scope.servico = data;

				//Inicializa o mapa
				var ll = 
					new google.maps.LatLng(
						$scope.servico.prestador.endereco.latitude,
						$scope.servico.prestador.endereco.longitude);

				$scope.mapOptions = {
					center: ll,
					zoom: 14,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				$scope.marker = new google.maps.Marker({
						map: $scope.map,
						position: ll
					});

				$scope.map.panTo(ll); //Centraliza o mapa
				Dialog.waitDialogClose();
			}
		);

		$scope.consultarForum = function() {
			ServiceForum.getForum($scope.idServico,
				function(data) {
					$scope.posts = data.posts;
				}
			);
		}

		$scope.post = function() {
			if ($scope.pergunta != null && $scope.pergunta != '') {
				Dialog.waitDialogOpen();
				ServiceForum.post(
					$scope.idServico,
					$scope.user.email,
					$scope.pergunta,
					$scope.user.apiKey,
					function(data) {
						// alert(JSON.stringify(data));
						Alerts.add(data, 'success');
						$scope.consultarForum();
						$scope.pergunta = '';
						Dialog.waitDialogClose();
					}
				);
			} else {
				Alerts.add('Preencher a pergunta!', 'warning');
			}
		};
	
		//TODO refatorar duplicação de método
		$scope.openAvaliacoes = function () {
			var modalInstance;

			Dialog.waitDialogOpen();
			ServicePrestadores.getAvaliacoes($scope.servico.prestador.email,
				function(data) {
					$scope.avaliacoes = data;
					Dialog.waitDialogClose();
					modalInstance = $modal.open({
						  templateUrl: 'partials/avaliacoes.html',
						  controller: 'AvaliacoesCtrl',
						  resolve: {				
							avaliacoes: function () {
							  return $scope.avaliacoes;
							}
						  }
					});
				}
			);
		};

		$scope.consultarForum();
	}
]);

//Controler Servico
SoSCtrls.controller('AvaliacoesCtrl', ['$scope', '$modalInstance',
	'avaliacoes', 'ServicePrestadores', 'Dialog',
	function($scope, $modalInstance, avaliacoes, ServicePrestadores, Dialog) {
		$scope.avaliacoes = avaliacoes;
		$scope.prestador = $scope.avaliacoes[0].usuario;

		Dialog.waitDialogOpen();
		ServicePrestadores.getPrestador($scope.prestador.email,
			function(data) {
				$scope.prestador = data;
				$scope.prestador.nota = parseFloat($scope.prestador.nota).toFixed(1);
				Dialog.waitDialogClose();
		});
	}
]);

//Controler Servico
SoSCtrls.controller('PrestadorCtrl', ['$scope', '$routeParams', 'Alerts',
	'ServicePrestadores', 'ServiceAvaliacoes', 'Dialog',
	function($scope, $routeParams, Alerts, ServicePrestadores, ServiceAvaliacoes, Dialog) {
		$scope.emailPrestador = $routeParams.emailPrestador;
		$scope.prestador = '';
		$scope.mensagem = '';	
		$scope.avaliacoes = [];
		$scope.servicos = [];
		$scope.mensagemWarn = false;

		$scope.avaliacao = {
			nota: 0,
			usuario_id: '',
			usuario_avaliador_email: $scope.user.email
		};

		$scope.mapOptions = {
			center: new google.maps.LatLng(
				-7.9712137, -34.839565100000016),
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		$scope.consultarServicos = function () {
			ServicePrestadores.getServicosPrestador($scope.emailPrestador,
				function(data) {
					$scope.servicos =  data;
				}
			);
		}

		$scope.consultarAvaliacoes = function () {
			ServicePrestadores.getAvaliacoes($scope.emailPrestador,
				function(data) {
					$scope.avaliacoes =  data;
				}
			);	
		}

		$scope.enviarAvaliacao = function () {
			$scope.avaliacao.usuario_avaliador_email = $scope.user.email;
			$scope.avaliacao.usuario_id = $scope.prestador.id;
			if ($scope.avaliacao.depoimento != null && $scope.avaliacao.depoimento != '') {
				Dialog.waitDialogOpen();
				ServiceAvaliacoes.avaliarPrestador($scope.avaliacao, $scope.user.apiKey,
					function(data) {
						$scope.avaliacao = {
							nota: 0,
							usuario_id: $scope.prestador.id,
							usuario_avaliador_email: $scope.user.email
						};
						$scope.consultarServicos();
						$scope.consultarAvaliacoes();
						Alerts.add(data, 'success');
						Dialog.waitDialogClose();
					}
				);				
			} else {
				Alerts.add("Preencha o depoimento!", 'warning');
			}
		}

		Dialog.waitDialogOpen();
		ServicePrestadores.getPrestador($scope.emailPrestador,
			function(data) {
				$scope.prestador = data;
				if($scope.prestador.nota){
					$scope.prestador.nota = parseFloat($scope.prestador.nota).toFixed(1);					
				}
				Dialog.waitDialogClose();
				//Inicializa o mapa
				var ll = 
					new google.maps.LatLng(
						$scope.prestador.endereco.latitude,
						$scope.prestador.endereco.longitude);

				$scope.mapOptions = {
					center: ll,
					zoom: 14,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				$scope.marker = new google.maps.Marker({
						map: $scope.map,
						position: ll
					});

				$scope.map.panTo(ll); //Centraliza o mapa

				$scope.consultarServicos();
				$scope.consultarAvaliacoes();		
			}
		);
	}
]);

//Controla o dialog de "sign in" / "sign up"
var LoginCtrl = function ($scope, $http, $modalInstance, Authentication, Alerts, user, Dialog) {
	
  $scope.user = user;
  $scope.user.email = '';
  $scope.progress = false;
			
  $scope.logar = function () {	  
	    
		if ( $scope.user.email != '' && $scope.user.email != null &&
				 $scope.user.senha != '' && $scope.user.senha != null) {
			Dialog.waitDialogOpen();
			$http({
				method : 'POST',
				url : 'http://soservices.vsnepomuceno.cloudbees.net/token/login',
				data : $scope.user,
				headers: {'Content-Type': 'application/json'}
			}).
			success(function(data, status, headers, config) {
				Dialog.waitDialogClose();
				Authentication.login($scope.user);
				$modalInstance.close(data);
			}).error(function(data, status, headers, config) {
				Dialog.waitDialogClose();
				Alerts.add('Erro: ' + status + ' ' + data, 'danger');
			});	
		} 
  };
  
  $scope.loginFace = function() {
	  $scope.faceUser = Authentication.getFacebookUser();
		$scope.faceUser.then(function(result) { 
			$http({
				method : 'POST',
				url : 'http://soservices.vsnepomuceno.cloudbees.net/token/login/facebook',
				data : Authentication.currentUser(),
				headers: {'Content-Type': 'application/json'}
			}).
			success(function(data, status, headers, config) {
				Dialog.waitDialogClose();
				$modalInstance.close(data);
			}).error(function(data, status, headers, config) {
				Dialog.waitDialogClose();
				Alerts.add('Erro: ' + status + ' ' + data, 'danger');
			});  
		});   
  };
  
  $scope.logarFace = function() {
	  $scope.isLogged = Authentication.checkLogged();
	  Dialog.waitDialogOpen();
	  $scope.isLogged.then(function(result) { 
		if (Authentication.isFaceLogged()) {
			$scope.loginFace();
		} else {
			$scope.login = Authentication.loginFace();
			$scope.login.then(function(result) {
				$scope.loginFace();
			});			
		}
		Dialog.waitDialogClose();	
	  });
	};

  $scope.cancel = function () {
	limparUsuario(user);
	$modalInstance.dismiss('cancel');
  };
};

//Controla o dialog de cadastro
var cadastrarCtrl = function ($scope, $http, $modalInstance, Alerts, user, Dialog) {
	
  $scope.user = user;
			
  $scope.cadastrar = function () {	 
	  
	 if ( $scope.user.email != '' && $scope.user.email != null && 
			 $scope.user.nome != '' && $scope.user.nome != '' && 
			 $scope.user.senha != '' && $scope.user.senha != '' && 
			 $scope.user.confirmarsenha != '' && $scope.user.confirmarsenha != null ) {
		 if (angular.equals($scope.user.senha, $scope.user.confirmarsenha) ) {
		 	Dialog.waitDialogOpen();
			$http({
				method : 'POST',
				url : 'http://soservices.vsnepomuceno.cloudbees.net/prestador/usuario',
				data : $scope.user,
				headers: {'Content-Type': 'application/json'}
			}).
			success(function(data, status, headers, config) {
				Dialog.waitDialogClose();
				$modalInstance.close(data);
			
			}).error(function(data, status, headers, config) {
				Dialog.waitDialogClose();
				Alerts.add('Erro: ' + status + ' ' + data, 'danger');
			});
		 }else {
				Alerts.add('Senha e confirmaÃ§&atilde;o diferentes!');
		  }
	  }
  };

  $scope.cancel = function () {
	limparUsuario(user);
	$modalInstance.dismiss('cancel');
  };
};

//Controla o dialog de cadastro
var cadastroPrestadorCtrl = function ($scope, $http, $modalInstance, Alerts, prestador, apiKey, Dialog) {
	
  	$scope.prestador = prestador;
	$scope.apiKey = apiKey;
	$scope.edit = false;	
	$scope.cadastrar = function () {	 
	  
		if ($scope.prestador.cpf != '' && $scope.prestador.cpf != null &&
			$scope.prestador.logradouro != '' && $scope.prestador.logradouro != null &&
			$scope.prestador.cep != '' && $scope.prestador.cep != null &&
			$scope.prestador.cidade != '' && $scope.prestador.cidade != null &&
			$scope.prestador.estado != '' && $scope.prestador.estado != null) {
				Dialog.waitDialogOpen();
				$http({
					method : 'PUT',
					url : 'http://soservices.vsnepomuceno.cloudbees.net/prestador',
					data : $scope.prestador,
					headers: {'Content-Type': 'application/json', 
								'token-api': $scope.apiKey}
				}).
				success(function(data, status, headers, config) {
					Dialog.waitDialogClose();
					$modalInstance.close(data);			
				}).error(function(data, status, headers, config) {
					Dialog.waitDialogClose();
					Alerts.add('Erro: ' + status + ' ' + data, 'danger');
				});
		}
	};	

 	
 	$scope.avaliacoes = function () {
 		$http({
 			method: 'GET',
 			url: 'http://soservices.vsnepomuceno.cloudbees.net/prestador/email?email='+$scope.user.email}).
 			success(function(data, status, headers, config, prest) {
 				if (data.cpf != data.email) {
 					$location.path('/avaliacoesPrest/email/'+$scope.user.email+
 							'/apiKey/'+$scope.user.apiKey);
 				} else {
 					Alerts.add('Você ainda não é um prestador, cadastre um anúncio!', 'warning');
 				}
 			}).
 			error(function(data, status, headers, config) {		
 				Alerts.add('Erro: ' + status +' '+ data, 'danger');
 			});	
 	};
  $scope.cancel = function () {
	  limparPrestador(prestador);
	$modalInstance.dismiss('cancel');
  };
};


//Controla o dialog de anuncio de servicos
var anuncioCtrl = function ($scope, $http,$modalInstance, Alerts, servico, tiposServicos, apiKey, Dialog) {
	$scope.servico = servico;
	$scope.tiposServicos = tiposServicos;
	$scope.apiKey = apiKey;
	
	$scope.cadastrar = function () {
		if ($scope.servico.descricao != '' && $scope.servico.nome_tipo_servico != '') {
			Dialog.waitDialogOpen();
			$http({
				method : 'POST',
				url : 'http://soservices.vsnepomuceno.cloudbees.net/servico',
				data : $scope.servico,
				headers: {'Content-Type': 'application/json', 
							'token-api': $scope.apiKey}
			}).
			success(function(data, status, headers, config) {
				Dialog.waitDialogClose();
				$modalInstance.close(data);
				$route.reload();
			
			}).error(function(data, status, headers, config) {
				Dialog.waitDialogClose();
				Alerts.add('Erro: ' + status + ' ' + data, 'danger');
			});
		}
	};
	
	$scope.cancel = function () {
		 $modalInstance.dismiss('cancel');
	};
};
	
var limparUsuario = function(user) {
	user.nome='';
	user.email='';
	user.senha='';
	user.confirmarsenha='';
};

/* Ctrl Anuncios */
SoSCtrls.controller('PrestadoresAnunciosCtrl', [ '$scope', '$route', '$http', '$location',
	'$modal', '$routeParams', 'Alerts','ServiceTpServico', 'ServicePrestadores', 'Dialog',
	function($scope, $route, $http, $location, $modal,
		$routeParams, Alerts, ServiceTpServico, ServicePrestadores,Dialog) {
		
		$scope.servico = {
				id: 0,
				descricao: '',
				valor: 0.0,
				nome_tipo_servico: '',
				usuario_email: ''
		};
		$scope.tiposServicos = new Array();
		$scope.email = $routeParams.email;
		$scope.apiKey = $routeParams.apiKey;
		$scope.orderProp = '-id';
		$scope.servicos = new Array();


		Dialog.waitDialogOpen();
		ServicePrestadores.getServicosPrestador($scope.email,
			function(data) {
				$scope.servicos = data;
				Dialog.waitDialogClose();
			}
		);

		ServiceTpServico.getTiposServicos(
			function(data) {
				$scope.tiposServicos = data;
			}
		);
		
		$scope.editar = function (id, tipoServico, valor, descricao) {
			$scope.servico.id = id;
			$scope.servico.descricao=descricao;
			$scope.servico.valor = valor;
			$scope.servico.nome_tipo_servico=tipoServico;
			$scope.servico.usuario_email = $scope.email;
			$scope.openEditarAnuncio();
		};
	
		$scope.remover = function (id) {
			var modalInstance;
			modalInstance = $modal.open({
				  templateUrl: 'partials/confirmDialog.html',
				  controller: 'confirmCtrl',
				  resolve: {				
				  }
				});
				modalInstance.result.then(function () {
					$http({
						method : 'DELETE',
						url : 'http://soservices.vsnepomuceno.cloudbees.net/servico/'+id,
						headers: {'Content-Type': 'application/json', 
									'token-api': $scope.apiKey}
					}).
					success(function(data, status, headers, config) {
						$route.reload();
						Alerts.add('ServiÃ§o removido com sucesso', 'success');
					}).error(function(data, status, headers, config) {
						Alerts.add('Erro: ' + status + ' ' + data, 'danger');
					}); 
				}, 
				function () {	});						
		};
		
		$scope.openEditarAnuncio = function () {
			var modalInstance;
			modalInstance = $modal.open({
				  templateUrl: 'partials/editarAnuncio.html',
				  controller: 'editarAnuncioCtrl',
				  resolve: {
					servico: function () {
						 return $scope.servico;
					},
					tiposServicos: function () {
						return $scope.tiposServicos;
					},
					apiKey: function () {
						return $scope.apiKey;
					}
				  }
				});
				modalInstance.result.then(function () {
					$route.reload();
					Alerts.add('Anuncio atualizado com sucesso!', 'success');
				}, 
				function () {

			});
				
		};			
		$scope.verForum = function (id) {
			$location.path('/forumPrest/email/'+$scope.user.email+
					'/apiKey/'+$scope.user.apiKey+
					'/servicoId/'+id);
		};
	
	} 
]);

//Controla o dialog de anuncio de servicos
var editarAnuncioCtrl = function ($scope, $http,$modalInstance, Alerts, servico, tiposServicos, apiKey) {
	$scope.servico = servico;
	$scope.tiposServicos = tiposServicos;
	$scope.apiKey = apiKey;
	$scope.salvar = function () {
		if ($scope.servico.descricao != '' && $scope.servico.nome_tipo_servico != '') {
			$http({
				method : 'PUT',
				url : 'http://soservices.vsnepomuceno.cloudbees.net/servico/'+$scope.servico.id,
				data : $scope.servico,
				headers: {'Content-Type': 'application/json', 
							'token-api': $scope.apiKey}
			}).
			success(function(data, status, headers, config) {
				$modalInstance.close(data);
			
			}).error(function(data, status, headers, config) {
				Alerts.add('Erro: ' + status + ' ' + data, 'danger');
			});
		}
	};
	
	$scope.cancel = function () {
		 $modalInstance.dismiss('cancel');
	};
};

//Controla o dialog de anuncio de servicos
var confirmCtrl = function ($scope, $http,$modalInstance, Alerts) {
	
	$scope.confirmar = function () {
		$modalInstance.close();
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};

//Controla o dialog de cadastro
var editPrestadorCtrl = function ($scope, $http, $modalInstance, Alerts, prestador, apiKey, Dialog) {
	
  $scope.prestador = prestador;
  $scope.apiKey = apiKey;
  $scope.edit = true;		
  $scope.cadastrar = function () {	 
	  
	 if ($scope.prestador.cpf != '' && $scope.prestador.cpf != null &&
			 $scope.prestador.logradouro != '' && $scope.prestador.logradouro != null &&
			 $scope.prestador.cep != '' && $scope.prestador.cep != null &&
			 $scope.prestador.cidade != '' && $scope.prestador.cidade != null &&
			 $scope.prestador.estado != '' && $scope.prestador.estado != null) {
			
			Dialog.waitDialogOpen();
			$http({
				method : 'PUT',
				url : 'http://soservices.vsnepomuceno.cloudbees.net/prestador',
				data : $scope.prestador,
				headers: {'Content-Type': 'application/json', 
							'token-api': $scope.apiKey}
			}).
			success(function(data, status, headers, config) {
				Dialog.waitDialogClose();
				$modalInstance.close(data);			
			}).error(function(data, status, headers, config) {
				Dialog.waitDialogClose();
				Alerts.add('Erro: ' + status + ' ' + data, 'danger');
			});
	  }
  };

  $scope.cancel = function () {
	limparPrestador(prestador);
	$modalInstance.dismiss('cancel');
  };
};

var limparPrestador = function(prestador) {
	prestador.cpf = '';
  	prestador.telefone = '';
  	prestador.logradouro = '';
  	prestador.numero = '';
  	prestador.complemento = '';
  	prestador.cep = '';
  	prestador.cidade = '';
  	prestador.estado = '';
};

var atualizarSenhaCtrl = function ($scope, $http, $modalInstance, Alerts, apiKey, email) {
	
	  $scope.apiKey = apiKey;
	  $scope.edit = true;	
	  $scope.senha = {
			  senhaAntiga: '',
			  novaSenha: '',
			  confirmarsenha: '',
			  email:''
	  };
	  
	  

	  $scope.atualizar = function() {

		if ($scope.senha.confirmarsenha != ''
				&& $scope.senha.confirmarsenha != null
				&& $scope.senha.novaSenha != ''
				&& $scope.senha.novaSenha != null) {
			if (angular.equals($scope.senha.novaSenha, $scope.senha.confirmarsenha)) {
				$scope.senha.email = email;
				$http({
					method : 'PUT',
					url : 'http://soservices.vsnepomuceno.cloudbees.net/prestador/atualizarSenha',
					data : $scope.senha,
					headers : {
						'Content-Type' : 'application/json',
						'token-api' : $scope.apiKey
					}
					}).success(function(data, status, headers, config) {
						$modalInstance.close(data);
					}).error(function(data, status, headers, config) {
						Alerts.add('Erro: ' + status + ' ' + data, 'danger');
					});
			}else {
				Alerts.add('Senha e confirmação diferentes!');
			}
		}
	};

	  $scope.cancel = function () {
	  $modalInstance.dismiss('cancel');
	 };
 };
 
 /* Ctrl avaliacoes de prestadores */
SoSCtrls.controller('AvaliacoesPrestCtrl', [ '$scope', '$route', '$http', '$location',
	'$modal', '$routeParams', 'Alerts', 'ServicePrestadores', 'ServiceAvaliacoes', 'Dialog',
	function($scope, $route, $http, $location, $modal, $routeParams, Alerts,
		ServicePrestadores, ServiceAvaliacoes, Dialog) {
			
		$scope.email = $routeParams.email;
		$scope.apiKey = $routeParams.apiKey;
		$scope.avaliacao = {
				id: 0,
				depoimento: '',
				replica: '',
				nota: 0
		};
		$scope.avaliacoes = new Array();
		$scope.prestador = '';
		$scope.orderProp = '-id';
		$scope.media = 0.0;
		$scope.replicaText='';

		$scope.consultarAvaliacoes = function() {
			Dialog.waitDialogOpen();

			ServicePrestadores.getAvaliacoes($scope.email,
				function(data) {
					$scope.avaliacoes = data;
					$scope.prestador = data.usuario;
					
					//TODO Refatorar para media ser retornada pela API como propriedade do prestador
					for (var i =0; i < $scope.avaliacoes.length; i++) {
						$scope.media += parseFloat($scope.avaliacoes[i].nota);
					}
					$scope.media /= $scope.avaliacoes.length;
					$scope.media = parseFloat($scope.media).toFixed(1);
					Dialog.waitDialogClose();
				}
			);
		}
		$scope.consultarAvaliacoes();
		
		$scope.responder = function(id, replicaText) {
			if (replicaText != '' && replicaText != null) {
				Dialog.waitDialogOpen();
				$scope.replica = {
						replica: replicaText,	
						email: $scope.email
				};

				ServiceAvaliacoes.responderAvaliacao(
					id,
					$scope.apiKey,
					$scope.replica,
					function(data) {
						Dialog.waitDialogClose();
						$scope.consultarAvaliacoes();
						Alerts.add(data, 'success');
					}
				);
			} else {
				Alerts.add('Replica deve ser preenchida!', 'warning');
			}
		};
	} 
]);

/* Ctrl Busca de prestadores */
SoSCtrls.controller('ForumPrestCtrl', [ '$scope', '$route', '$http', '$location',
	'$modal', '$routeParams', 'Alerts', 'Dialog', 'ServiceForum', 'ServiceServicos',
	function($scope, $route, $http, $location, $modal, $routeParams,
		Alerts, Dialog, ServiceForum, ServiceServicos) {
			
		$scope.post = {
				id: 0,
				mensagem: '',
				resposta: '',
				nomeUsuario: ''
		};
		$scope.forum = new Array();
		$scope.servico= new Array();
		$scope.orderProp = '-prestador.media';
		$scope.respostaText='';

		$scope.email = $routeParams.email;
		$scope.apiKey = $routeParams.apiKey;
		$scope.servicoId = $routeParams.servicoId;
		
		$scope.consultarForum = function(){
			Dialog.waitDialogOpen();
			ServiceForum.getForum($scope.servicoId,
				function(data) {
					$scope.forum = data;
					Dialog.waitDialogClose();
				}
			);	
		}
		$scope.consultarForum();

		ServiceServicos.getServico($scope.servicoId,
			function(data) {
				$scope.servico = data;
			}
		);		
		
		$scope.responder = function(id, respostaText) {
			if (respostaText != '' && respostaText != null) {
				$scope.resposta = {
						resposta: respostaText,	
						email: $scope.email
				};
				$http({
					method : 'PUT',
					url : 'http://soservices.vsnepomuceno.cloudbees.net/forum/resposta?id='+id,
					data : $scope.resposta,
					headers : {
						'Content-Type' : 'application/json',
						'token-api' : $scope.apiKey
					}
					}).success(function(data) {
						Alerts.add(data, 'success');
						$scope.consultarForum();
					}).error(function(data, status, headers, config) {
						Alerts.add('Erro: ' + status + ' ' + data, 'danger');
					});
			} else {
				Alerts.add('Resposta deve ser preenchida!');
			}
		};
	} 
]);


SoSCtrls.controller('waitDialogCtrl', ['$scope', '$modalInstance', '$timeout',
          function ($scope, $modalInstance, $timeout) {
 
    // close wait dialog
    $scope.$on('dialogs.wait.complete', function () {
        $timeout(function () {
            $modalInstance.close();
        });
    }); 
 
   
}]) 