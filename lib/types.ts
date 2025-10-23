
type Label = {
  label: string;
}

type CategoryAttributes = {
  "im:id": string;
  scheme: string;
  term: string
} & Label

type Category = {
  attributes: CategoryAttributes
}

type AlbumId = {
  attributes: {
    "im:id": string
  }
} & Label

type ImArtist = {
  attributes: {
    href: string
  }
} & Label

type ImContentType = {
  attributes: Label & {
    term: CategoryAttributes['term']
  }
}

type ImImage = {
  attributes: { height: 'string' }
} & Label

type PriceAttribute = {
  amount: string;
  currency: string
}

type ImPrice = {
  attributes: PriceAttribute
} & Label

type ImReleaseDate = {
  attributes: Label
} & Label

type LinkAttributes = {
  href: string;
  rel: string;
  type: string
}

type Link = {
  attributes: LinkAttributes
}

export type Entry = {
  category: Category;
  id: AlbumId;
  "im:artist": ImArtist
  "im:contentType": ImContentType
  "im:image": ImImage[]
  "im:itemCount": Label
  "im:name": Label
  "im:price": ImPrice
  "im:releaseDate": ImReleaseDate
  link: Link;
  rights: Label;
  title: Label
}

type Author = {
  name: Label;
  uri: Label
}

export type Feed = {
  author: Author;
  entry: Entry[]
  icon: Label;
  id: Label;
  link: Link[];
  rights: Label;
  title: Label;
  updated: Label
}
