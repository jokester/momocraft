import React from 'react';

export const FrontpageIntro: React.FC = () => {
  return (
    <div className="mt-20 px-4 md:px-8 lg:px-16 leading-tight">
      <h2 className="text-2xl mb-2 font-semibold">Momocraft</h2>
      <p>
        <span className="font-semibold">Momocraft</span> 是一个帮助动森玩家记录物品收藏和交换收藏 (俗称 "摸摸") 的网站.
      </p>
      <p>本站目前主要功能还在施工, 欢迎注册一下, 不时回来看看.</p>
    </div>
  );
};