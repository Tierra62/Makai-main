import chevronUp from 'assets/img/icons/chevron-up.svg';
import doubleChevronUp from 'assets/img/icons/double-chevron-up.svg';
import tripleChevronUp from 'assets/img/icons/triple-chevron-up.svg';

export const courseFilters = [
  {
    label: 'Category',
    options: [
      {
        label: 'Free',
        icon: 'file-alt',
        type: 'checkbox',
        value: 'free course',
        name: 'free course'
      },
      {
        label: 'Paid',
        icon: 'file-invoice-dollar',
        type: 'checkbox',
        value: 'paid course',
        name: 'paid course'
      },
      {
        label: 'On Sale',
        icon: 'tags',
        iconShrink: true,
        type: 'checkbox',
        value: 'on sale',
        name: 'on sale'
      }
    ]
  },
  {
    label: 'Subject',
    options: [
      {
        label: 'Design',
        icon: 'brush',
        type: 'checkbox',
        value: 'design',
        name: 'design'
      },
      {
        label: 'Web Development',
        icon: 'globe',
        type: 'checkbox',
        value: 'development',
        name: 'development'
      },
      {
        label: 'Software',
        icon: 'code',
        type: 'checkbox',
        value: 'software',
        name: 'software'
      },
      {
        label: 'Business',
        icon: 'balance-scale-left',
        type: 'checkbox',
        value: 'business',
        name: 'business'
      },
      {
        label: 'Marketing',
        icon: 'comment-dollar',
        type: 'checkbox',
        value: 'marketing',
        name: 'marketing'
      },
      {
        label: 'Self Help',
        icon: 'hand-holding-water',
        type: 'checkbox',
        value: 'self help',
        name: 'self help'
      },
      {
        label: 'Photography',
        icon: 'camera-retro',
        type: 'checkbox',
        value: 'photograpy',
        name: 'photograpy'
      },
      {
        label: 'Music',
        icon: 'music',
        type: 'checkbox',
        value: 'music',
        name: 'music'
      },
      {
        label: 'Writing',
        icon: 'pen-nib',
        type: 'checkbox',
        value: 'writing',
        name: 'writing'
      },
      {
        label: 'Painting',
        icon: 'palette',
        type: 'checkbox',
        value: 'painting',
        name: 'painting'
      },
      {
        label: 'Cooking',
        icon: 'utensils',
        type: 'checkbox',
        value: 'cooking',
        name: 'cooking'
      },
      {
        label: 'Teaching',
        icon: 'book',
        type: 'checkbox',
        value: 'teaching',
        name: 'teaching'
      },
      {
        label: 'Miscellaneous',
        icon: 'thumbtack',
        type: 'checkbox',
        value: 'misc',
        name: 'misc'
      }
    ]
  },
  {
    label: 'Rating',
    options: [
      {
        label: '4.5 & Up',
        icon: 'star',
        type: 'radio',
        name: 'rating',
        value: 4.5
      },
      {
        label: '4.0 & Up',
        icon: 'star',
        type: 'radio',
        name: 'rating',
        value: 4.0
      },
      {
        label: '3.5 & Up',
        icon: 'star',
        type: 'radio',
        name: 'rating',
        value: 3.5
      },
      {
        label: '3.0 & Up',
        icon: 'star',
        type: 'radio',
        name: 'rating',
        value: 3.0
      }
    ]
  },
  {
    label: 'Proficiency',
    options: [
      {
        label: 'Beginner',
        svg: chevronUp,
        type: 'checkbox',
        value: 'beginner',
        name: 'beginner'
      },
      {
        label: 'Intermediate',
        svg: doubleChevronUp,
        type: 'checkbox',
        value: 'intermediate',
        name: 'intermediate'
      },
      {
        label: 'Professional',
        svg: tripleChevronUp,
        type: 'checkbox',
        value: 'professional',
        name: 'professional'
      },
      {
        label: 'Master',
        icon: 'star',
        type: 'checkbox',
        value: 'master',
        name: 'master'
      },
      {
        label: 'Everyone',
        icon: 'users',
        type: 'checkbox',
        value: 'everyone',
        name: 'everyone'
      }
    ]
  },
  {
    label: 'Language',
    options: [
      {
        label: 'English',
        type: 'checkbox',
        selected: true,
        value: 'english',
        name: 'english'
      },
      {
        label: 'Spanish',
        type: 'checkbox',
        value: 'spanish',
        name: 'spanish'
      },
      {
        label: 'French',
        type: 'checkbox',
        value: 'french',
        name: 'french'
      },
      {
        label: 'German',
        type: 'checkbox',
        value: 'german',
        name: 'german'
      },
      {
        label: 'Bengali',
        type: 'checkbox',
        value: 'bengali',
        name: 'bengali'
      },
      {
        label: 'Hindi',
        type: 'checkbox',
        value: 'hindi',
        name: 'hindi'
      },
      {
        label: 'Arabic',
        type: 'checkbox',
        value: 'arabic',
        name: 'arabic'
      }
    ]
  },
  {
    label: 'Enrolled Courses',
    options: [
      {
        label: 'Show',
        name: 'enrolledCourses',
        type: 'radio',
        value: 'all courses'
      },
      {
        label: 'Dont Show',
        name: 'enrolledCourses',
        type: 'radio',
        value: 'new courses'
      }
    ]
  }
];

export const courseData = {
  writing: {
    id: 1,
    type: 'primary',
    content: 'Writing',
    icon: 'pen-nib'
  },
  topTrainer: {
    id: 2,
    type: 'success',
    content: 'Top Trainer',
    icon: 'crown'
  },
  editorsChoice: {
    id: 3,
    type: 'warning',
    content: 'Editor’s Choice',
    icon: 'award'
  },
  misc: {
    id: 4,
    type: 'primary',
    content: 'Misc.',
    icon: 'thumbtack'
  },
  design: {
    id: 5,
    type: 'primary',
    content: 'Design',
    icon: 'brush'
  },
  bestSeller: {
    id: 6,
    type: 'success',
    content: 'Best Seller',
    icon: 'hashtag'
  },
  painting: {
    id: 7,
    type: 'primary',
    content: 'Painting',
    icon: 'palette'
  }
};
