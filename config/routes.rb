Rails.application.routes.draw do
  root 'main#index'

  resources :travels, only: [:index,:new,:edit,:show,:destroy]
  devise_for :users, controllers: {
        registrations: 'users/registrations'
      }

  get 'main/index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
