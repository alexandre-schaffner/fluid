class PagesUrls {
  readonly frontHost: string;
  readonly authorizeStreamingPlatformPage: string;
  readonly homePage: string;
  readonly selectPlaylistPage: string;
  readonly authorizeYouTubePage: string;

  constructor() {
    switch (process.env.NODE_ENV) {
      case 'production':
        this.frontHost = 'https://www.fluidsync.app';
        break;
      case 'development':
        this.frontHost = 'http://localhost:3000';
        break;
      default:
        this.frontHost = 'http://localhost:3000';
        break;
    }
    this.authorizeStreamingPlatformPage =
      this.frontHost + '/authorize/streaming-platform';
    this.homePage = this.frontHost + '/fluids/app';
    this.selectPlaylistPage = this.frontHost + '/playlist';
    this.authorizeYouTubePage = this.frontHost + '/authorize/youtube';
  }

  generateAuthorizeYouTubePageUrl(user: string, state: string): string {
    return this.authorizeYouTubePage + '?user=' + user + '&state=' + state;
  }
}

export const pagesUrls = new PagesUrls();
