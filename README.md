# android_strings_to_excel
Command line을 통해 쉽게 string.xml 파일을 엑셀 파일로 또는 엑셀파일을 strings.xml 파일로 정리할 수 있습니다 😃

## Install
```sh
npm install
```
## Usage
```sh
npm run parser
```

### 디렉토리 구조
``` bash
  |-results                                #convert된 결과를 저장하는 디렉토리
  |  |-excel                               #XML -> Excel 변환 결과 저장
  |  |-xml                                 #Excel -> XML 변환 결과 저장
  |-target                                 #convert할 데이터 파일이 있어야 하는 디렉토리
  |  |-excel                               #XML로 변환이 필요한 excel 데이터
  |  |-xml                                 #excel로 변환이 필요한 XML 데이터
  |-parser.js                              #데이터 파싱 및 파일 생성을 하는 코드
```


### 상세 설명
`npm run parser` 명령어를 사용해 실행을 하면 아래와 같이 2가지 선택 메뉴가 나옵니다.
`
  1) strings.xml => excel
  2) excel => string.xml
`

1)번을 선택하면 strings.xml 파일을 excel로 파싱하고 결과를 `results/excel` 디렉토리에 저장합니다.
target/xml 디렉토리 안에 아래의 구조와 같이 strings.xml 파일이 필요합니다.

`
1개 이상의 strings.xml 파일이 필요
target/xml/values/strings.xml
target/xml/values-ko/strings.xml
target/xml/values-jp/strings.xml
`

2)번을 선택할 경우 excel 파일의 내용을 strings.xml 파일로 변환하여 `results/xml` 디렉토리에 저장합니다.

`
target/excel 디렉토리 안에 1개 이상의 xlsx 파일이 필요
`
