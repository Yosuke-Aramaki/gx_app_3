Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      post 'sign_up',  to: 'users#create'
      get  '/login',   to: 'sessions#new'
      post '/login',   to: 'sessions#create'
      resources :users
    end
  end
end
