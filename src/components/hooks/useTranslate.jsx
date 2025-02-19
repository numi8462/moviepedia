import { useLocale } from "../contexts/LocaleContext";

const dict = {
  ko: {
    "confirm button": "확인",
    "cancel button": "취소",
    "edit button": "수정",
    "delete button": "삭제",
    "latest button": "최신순",
    "rating button": "베스트순",
  },
  en: {
    "confirm button": "OK",
    "cancel button": "Cancel",
    "edit button": "Edit",
    "delete button": "Delete",
    "latest button": "Latest",
    "rating button": "Best",
  },
};

function useTranslate() {
  const locale = useLocale();
  const translate = (key) => dict[locale][key] || "";
  return translate;
}

export default useTranslate;
