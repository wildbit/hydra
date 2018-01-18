import Store from 'models/Store.ts';

export const InstanceValidator = () => {
  const rules = {
    'name': [
      {
        'validate': ({ current, value }) => {
          const unique = (x) => x.display_name.toLowerCase() === value.toLowerCase();
          let { display_name } = (current || {});

          return Store.instance.List()
            .filter(x => x.display_name !== display_name)
            .filter(unique).length === 0
        },
        'message': 'The name for instance must be unique.',
      },
      {
        'validate': ({ value }) => {
          return value.length > 0;
        },
        'message': 'A name for this instance is required.',
      }
    ],
    'url': [
      {
        'validate': ({ value }) => {
          const url = /^http(s)?:\/\/[a-z0-9.-]+([:][0-9]{1,5}(\\|\/)?)?$/i;
          return url.test(value);
        },
        'message': 'This must be a valid http or https url.',
      },
      {
        'validate': ({ value }) => {
          const ssl = /^https:/i;

          if (ssl.test(window.location.protocol)) {
            return ssl.test(value);
          }

          return true;
        },
        'message': 'Because this interface was loaded over https, only https urls are supported.'
      }
    ]
  };

  return {
    fields: Object.keys(rules),
    validate: ({ current, field, value }) => {
      let errors = [];

      (rules[field] || []).forEach(rule => {
        if (!rule.validate({ current, value })) {
          errors.push(rule.message);
        }
      });

      return errors;
    }
  }
};
