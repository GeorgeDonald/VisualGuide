Rails.application.routes.draw do
  root 'main#index'
  get 'main/index'

  resources :records, only: [:index, :new, :edit, :create, :destroy, :update, :show]
  resources :guides, only: [:index, :new, :edit, :show, :destroy, :create, :update]
  resources :travels, only: [:index, :new, :edit, :show, :destroy, :create, :update]
  devise_for :users, controllers: {
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }

  post '/current_positions/update', to: 'current_positions#update'
  get '/guides/:id/stop', to: 'guides#stop'
  post '/messages/index', to: 'messages#index'
  post '/records/video', to: 'records#video'


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
