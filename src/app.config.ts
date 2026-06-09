export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/video/index',
    'pages/vip/index',
    'pages/mine/index',
    'pages/detail/index',
    'pages/search/index',
    'pages/video-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'AI 科普知识库',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: '#999999',
    selectedColor: '#07C160',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '推荐'
      },
      {
        pagePath: 'pages/category/index',
        text: '分类'
      },
      {
        pagePath: 'pages/video/index',
        text: '视频'
      },
      {
        pagePath: 'pages/vip/index',
        text: 'VIP'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
