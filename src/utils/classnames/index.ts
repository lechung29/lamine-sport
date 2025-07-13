/** @format */

import _ from "lodash";

/**
 * The `classNames` function accepts any number of arguments,
 * which can be either strings or objects. When you pass the argument ‘foo’,
 * it is equivalent to `{ foo: true }`.
 * If the value associated with a given key is falsy, that key won’t be included in the output
 *
 * @example
 * classNames('foo', 'bar'); // => 'foo bar'
 * classNames('foo', { bar: true }); // => 'foo bar'
 * classNames({ 'foo-bar': true }); // => 'foo-bar'
 * classNames({ 'foo-bar': false }); // => ''
 * classNames({ foo: true }, { bar: true }); // => 'foo bar'
 * classNames({ foo: true, bar: true }); // => 'foo bar'
 *
 * // lots of arguments of various types
 * classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'
 *
 * // other falsy values are just ignored
 * classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
 */
export const classNames = (...args) => {
    const classes = _.flatMap(args, (arg) => {
        if (_.isString(arg) || _.isNumber(arg)) {
            return arg;
        }

        if (_.isArray(arg)) {
            return arg;
        }

        if (_.isObject(arg)) {
            return _.keys(_.pickBy(arg, Boolean));
        }

        return [];
    });

    return _.compact(classes).join(" ");
};

export const capitalizeFirstLetter = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
