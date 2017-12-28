Rails.application.routes.draw do
  devise_for :users, controllers: {
        registrations: 'users/registrations'
      }
  root 'main#index'
  get 'main/index'

  get '/routestart', to: 'main#routestart'
  post '/routestart', to: 'main#routestart_create'
  get '/routestop', to: 'main#routestop'
  post '/routestop', to: 'main#routestop_create'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
