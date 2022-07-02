import { Editor } from 'roosterjs-editor-core';
import { GetContentMode } from 'roosterjs-editor-types';
import {
  findNearestTagCharacter,
  findFirstDifferent,
  filterTags,
  renderDropdown,
  processTagData,
  checkForExactMatch,
  selectFirst,
} from './helpers';

import './style.scss';

export default class TagsPlugin {
  constructor(options) {
    this.editorDivId = options.editorDivId;
    this.uniqueHash = options.uniqueHash;
    this.tagData = options.tagData || mockData();
  }

  static validTagCharacters = '@#$*';
  static defaultTagConfig = {
    allowSpaces: false,
    maxLength: 20,
    searchFields: ['label'],
    tags: [],
  };

  getName() {
    return 'TagsPlugin';
  }

  initialize(editor) {
    this.editor = editor;

    this.previousContent = '';
    this.content = '';
    this.cursorLocation = 0;
    this.lastContentRetrieval = Date.now();
    this.editor.getTags = this.getTags.bind(this);

    processTagData.call(this);
  }

  dispose() {
    this.editor = null;
  }

  // Gets the current tags in the editor
  getTags() {
    let tagElements = document.querySelectorAll(`[${this.uniqueHash}] .barnyardjs-editor-tag`);
    let foundTags = {};

    Array.from(tagElements).forEach(tagElement => {
      let dataset = tagElement.dataset;

      if (!foundTags[dataset.tagtype]) foundTags[dataset.tagtype] = [];
      foundTags[dataset.tagtype].push(
        this.tagData[dataset.tagtype].tags.find(tag => tag.key === dataset.tagkey)
      );
    });

    return foundTags;
  }

  onPluginEvent(e) {
    // Prevents getContent from calling itself and causing call stack size to be exceeded
    if (Date.now() - this.lastContentRetrieval > 5) {
      this.lastContentRetrieval = Date.now();

      this.previousContent = this.content;
      this.content = this.editor.getContent();
    }

    if (this.previousContent !== this.content) {
      let editor = document.querySelector(`[${this.uniqueHash}] .barnyardjs-editor`);
      let node = document.createElement('span');
      node.innerText = '|';

      // Gets the cursors location
      this.editor.insertNode(node);
      this.cursorLocation = editor.innerHTML.indexOf(`<span>|</span>`);
      this.editor.deleteNode(node);

      // Find the nearest tag character and the string to search for tags
      let tagChar = findNearestTagCharacter.call(this, this.content, 0, this.cursorLocation + 1);
      let searchStr = this.content.substring(tagChar?.pos + 1, this.cursorLocation);
      let searchRange = {
        searchStart: tagChar?.pos,
        searchEnd: this.cursorLocation,
      };

      // Filter tags
      let filteredTags = filterTags.call(
        this,
        searchStr,
        this.tagData[tagChar?.char]?.tags,
        this.tagData[tagChar?.char]?.searchFields,
        tagChar?.char
      );

      if (filteredTags.length && checkForExactMatch(filteredTags, searchStr)) {
        selectFirst.call(this, filteredTags, searchRange);
      } else {
        renderDropdown.call(this, filteredTags, searchRange);
      }
    }
  }
}

function mockData() {
  return {
    '@': {
      allowSpaces: true,
      maxLength: 20,
      searchFields: ['label'],
      matt: true,
      tags: [
        {
          label: 'Matthew Saxe',
          value: 0,
          image:
            'https://bloximages.newyork1.vip.townnews.com/citizensvoice.com/content/tncms/assets/v3/editorial/8/30/83033f75-cdfa-5878-9702-a113f20a0586/5e580f3346c58.image.jpg',
          helpText: 'Engineer',
        },
        {
          label: 'Sam Saxe',
          value: 1,
          image: 'https://pbs.twimg.com/profile_images/1118699523210010624/Els45sYl_400x400.jpg',
          helpText: 'Geo Analyst',
        },
        {
          label: 'Joe Shmoe',
          value: 2,
          image:
            'https://static.acne.org/ipb_uploads/monthly_2021_02/B1383419-9C69-4DB6-B94B-D4507256911E.thumb.jpeg.a421ae87985c29e3d9710e5c6d2dd725.jpeg',
          helpText: 'Carpenter',
        },
        {
          label: 'Big Dawg',
          value: 3,
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTopj6N00sl9tFso1KgWBhOqxayRtSsPbun-A&usqp=CAU',
          helpText: 'Bodyguard',
        },
        {
          label: 'Bimbo',
          value: 4,
          image: 'https://images.financialexpress.com/2020/09/kartik-kala-1.jpg',
          helpText: 'Unemployed',
        },
        {
          label: 'John Doe',
          value: 5,
          image:
            'https://bestcellphonespyapps.com/wp-content/uploads/2017/09/pexels-photo-220453-1-1001x1024.jpeg',
          helpText: 'Clerk',
        },
        {
          label: 'Jane Doe',
          value: 6,
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbEJ-_NqQEZIvBUDUqqQCwTBu8dldfQysdOQ&usqp=CAU',
          helpText: 'Secretary',
        },
        {
          label: 'Jimmy John',
          value: 7,
          image: 'https://www.marlerblog.com/files/2020/02/Jimmy-Johns-Founder.jpg',
          helpText: 'Sandwich king',
        },
        {
          label: 'Little Dawg',
          value: 8,
          image:
            'https://lesgarden.com/storage/images/105793166-skinny-young-man-muscle-flexing-on-the-white-wall-background.jpg',
          helpText: 'Bodybuilder',
        },
        {
          label: 'Jeffrey',
          value: 9,
          image:
            'https://preview.redd.it/rcwsb9pnihw21.jpg?auto=webp&s=b31ee87510448bd0db04e95514879bcbf9d205c0',
          helpText: 'Architect',
        },
        {
          label: 'Dwayne Johnson',
          value: 10,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/1/1f/Dwayne_Johnson_2014_%28cropped%29.jpg',
          helpText: 'Actor',
        },
        {
          label: 'Aaliyah Kashyap',
          value: 11,
          image:
            'https://images.hindustantimes.com/img/2021/06/08/550x309/193197574_307878937618749_8630090066141767698_n_1623137800420_1623137811962.jpg',
          helpText: 'Model',
        },
      ],
    },
    '#': {
      maxLength: 15,
      tags: [
        { label: 'crypto', value: 0 },
        { label: 'fitness', value: 1 },
        { label: 'bitcoin', value: 2 },
        { label: 'financial freedom', value: 3 },
        { label: 'solana', value: 4 },
      ],
    },
    $: [
      { label: 'BTC', value: 0, image: 'https://g.foolcdn.com/art/companylogos/square/btc.png' },
      {
        label: 'ETH',
        value: 1,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png',
      },
      {
        label: 'SOL',
        value: 2,
        image: 'https://vectorlogo4u.com/wp-content/uploads/2021/09/solana-logo-vector-01.png',
      },
      {
        label: 'ADA',
        value: 3,
        image: 'https://ak.picdn.net/shutterstock/videos/1007246662/thumb/6.jpg',
      },
      {
        label: 'DAG',
        value: 4,
        image: 'https://constellationnetwork.io/wp-content/uploads/2021/04/Logo.png',
      },
    ],
  };
}
