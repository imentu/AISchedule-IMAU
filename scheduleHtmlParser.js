function scheduleHtmlParser(html) {
    //除函数名外都可编辑
    //传入的参数为上一步函数获取到的html
    //可使用正则匹配
    //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
    //以下为示例，您可以完全重写或在此基础上更改

    function weekZh2Num (zh) {
        const map = {
            '一' : 1,
            '二' : 2,
            '三' : 3,
            '四' : 4,
            '五' : 5,
            '六' : 6,
            '日' : 7,
        }
        return map[zh];
    }



    let courseInfos = []

    let courseTrs = $('table.infolist_tab').eq(0).children().children().first().siblings()
    for (let i = 0; i < courseTrs.length; i++) {
        let courseTds = courseTrs.eq(i).children('td')
        let name = courseTds.eq(2).text().trim()
        let teacher = courseTds.eq(3).text().trim()
        let timeTrs = courseTds.eq(9).find('tr')
        for (let j = 0; j < timeTrs.length; j++) {
            let course = {sections:[], weeks:[]}
            course['name'] = name
            course['teacher'] = teacher

            let timeTds = timeTrs.eq(j).children('td')

            let weekStr = timeTds.eq(0).text().trim()
            let weekRange = ['0', '0']
            let isEachWeek = true
            let single = true
            if(weekStr.includes('单')) {
                isEachWeek = false
                let single = true
                weekRange = weekStr.substring(1, weekStr.length - 2).split('-')
            } else if(weekStr.includes('双')) {
                isEachWeek = false
                single = false
                weekRange = weekStr.substring(1, weekStr.length - 2).split('-')
            } else {
                weekRange = weekStr.substring(1, weekStr.length - 1).split('-')
            }
            let start = Number(weekRange[0])
            let end = Number(weekRange[1])
            let weeks = []
            for (let k = start; k <= end; k++) {
                if (!isEachWeek) {
                    if (single && k % 2 === 0) {
                        continue
                    } else if (!single && k % 2 !== 0) {
                        continue
                    }
                }
                weeks.push(k)
            }
            course['weeks'] = weeks

            let weekDayStr = timeTds.eq(1).text().trim()
            if (weekDayStr == '&nbsp;') continue
            course['day'] = weekZh2Num(weekDayStr.substring(weekDayStr.length - 1))

            let sectionStr = timeTds.eq(2).text().trim().substring(1, 2)
            function genSection(num) {
                return [{'section': num * 2 - 1}, {'section': num * 2}]
            }
            course['sections'] = genSection(weekZh2Num(sectionStr))

            let positionStr = timeTds.eq(3).text().trim()
            course['position'] = positionStr

            courseInfos.push(course)
        }    
    }

    console.log(JSON.stringify({ courseInfos: courseInfos }))

    return { courseInfos: courseInfos }
    
}