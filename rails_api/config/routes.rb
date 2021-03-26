Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      post 'sign_up',  to: 'users#create'           # ユーザー登録
      post 'signin',    to: 'sessions#create'        # ログイン
      post 'logout',   to: 'sessions#destroy'       # ログアウト
      post 'password_reset',   to: 'sessions#update'       # パスワードの更新
      get  'test',     to: 'articles#health_check'  # 疎通確認


      resources :users, only: [:create] do
      end

      resources :articles, only: [:index, :create, :edit, :update, :destroy] do
        put :update_is_read, on: :member
      end
      get 'all_unread_or_read_articles', to: 'articles#all_unread_or_read_articles'
      get 'categorised_articles',        to: 'articles#categorised_articles'
      get 'already_saved',               to: 'articles#already_saved'
      post 'save_article_from_url',      to: 'articles#save_article_from_url'

      resources :categories, only: [:index, :create, :edit, :update, :destroy] do
      end

      resource :reminds, only: [:create, :edit, :update, :destroy]
      get 'get_remind_info', to: 'reminds#index'
      get 'get_remind_time', to: 'reminds#get_remind_time'
      post 'check_reminds',  to: 'reminds#check_reminds'

    end
  end
end
