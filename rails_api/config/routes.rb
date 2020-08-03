Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      post 'sign_up',  to: 'users#create'  # ユーザー登録
      post 'login',   to: 'sessions#create'  # ログイン
      get 'test', to: 'articles#test'

      
      resources :users, only: [:create] do 
      end 
      
      resources :articles, only: [:index, :create, :edit, :update, :destroy] do
        put :update_is_read, on: :member
      end
      get 'all_unread_or_read_articles', to: 'articles#all_unread_or_read_articles'
      get 'categorised_articles', to: 'articles#categorised_articles'
      get 'already_saved', to: 'articles#already_saved'
      post 'save_article_from_url', to: 'articles#save_article_from_url'

      resources :categories, only: [:index, :create, :edit, :update, :destroy] do 
      end 

      resources :reminds, only: [:index, :create, :edit, :update, :destroy] do 
      end 

    end
  end
end
