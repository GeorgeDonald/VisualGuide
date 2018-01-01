Rails.application.routes.draw do
  root 'main#index'
  get 'main/index'

  resources :guides, only: [:index, :show, :new, :create]
  resources :travels, only: [:index,:new,:edit,:show,:destroy,:create,:update]
  devise_for :users, controllers: {registrations: 'users/registrations'}

  post '/current_positions/update', to: 'current_positions#update'


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
