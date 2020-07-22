Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      post 'sign_up',  to: 'users#create'  # ユーザー登録
      post 'login',   to: 'sessions#create'  # ログイン
      get 'test', to: 'articles#test'
      resources :articles, only: [:index, :create, :edit, :update, :delete]
      resources :users, only: [:create] do 
      end 
    end
  end
end
