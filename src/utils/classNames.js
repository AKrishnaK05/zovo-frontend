// frontend/src/utils/classNames.js
export default function classNames(...args) {
  return args.filter(Boolean).join(' ')
}
