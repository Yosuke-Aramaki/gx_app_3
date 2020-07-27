Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      post 'sign_up',  to: 'users#create'  # ユーザー登録
      post 'login',   to: 'sessions#create'  # ログイン
      get 'test', to: 'articles#test'
      get 'already_saved', to: 'articles#already_saved'

      resources :users, only: [:create] do 
      end 

      resources :articles, only: [:index, :create, :edit, :update, :destroy] do
        put :update_is_read, on: :member
      end

      resources :categories, only: [:index, :create, :edit, :update, :destroy] do 
      end 

    end
  end
end
