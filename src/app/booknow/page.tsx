import BookOnlinePage, { metadata as bookMetadata } from '../book-online/page';

export const metadata = {
  ...bookMetadata,
  alternates: {
    canonical: 'https://www.sweetmaidcleaning.com/booknow/',
  }
};

export default BookOnlinePage;
