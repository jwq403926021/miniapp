const KeyMap = {
  'PolicyStatus': 'status',
  'IsFinalLevelCt': 'isCode',
  'CoverageCode': '',
  'BenefitCode': '',
  'ReportDelayCause': 'delayReportReason',
  'AccidentCause': 'reportReason',
  'IsCatastrophe': 'isCode',
  'CatastropheCode': '',
  'ReportType': 'reportType',
  'InsuredRelation': 'relationship',
  'SubClaimType': 'childCompensationCategory',
  'TotalLoss': 'isCode',
  'CertiType': 'certificationCategory',
  'Sex': 'genderCode',
  'InjuryType': 'injuryCategory',
  'InjuryLevel': 'injuryDegree',
  'DisabilityGrade': 'injuryLevel',
  'Treatment': 'cureWay',
  'AppraisalType': 'lossAssessmentCategory',
  'IsDocQualified': 'isCode',
  'TaskType': 'missionCategory',
  'IsConfirmed': 'isCode',
  'PropertyNature': 'buildingCategory',
  'IsInvolveRecovery': 'isCode',
  'LossItemType': 'lossCategory',
  'OperationType': 'operationType',
  'ReserveType': 'compensationCategory',
  'PayMode': 'payMode',
  'AccountType': 'transferCategory',
  'BankCode': 'bank',
  'CalculationFormula': 'calculationFormula',
  'ProductType': 'productType',
}

const orderStatus = {
  '10': '待查勘',
  '11': '线下已提交',
  '12': '已查勘',
  '13': '待理算',
  '14': '待核损',
  '15': '核损通过',
  '16': '已关闭'
}
const areaList = [{
  children: [
    {
      children: [
        {
          value: '310101',
          label: '黄浦区'
        },
        {
          value: '310104',
          label: '徐汇区'
        },
        {
          value: '310105',
          label: '长宁区'
        },
        {
          value: '310106',
          label: '静安区'
        },
        {
          value: '310107',
          label: '普陀区'
        },
        {
          value: '310109',
          label: '虹口区'
        },
        {
          value: '310110',
          label: '杨浦区'
        },
        {
          value: '310112',
          label: '闵行区'
        },
        {
          value: '310113',
          label: '宝山区'
        },
        {
          value: '310114',
          label: '嘉定区'
        },
        {
          value: '310115',
          label: '浦东新区'
        },
        {
          value: '310116',
          label: '金山区'
        },
        {
          value: '310117',
          label: '松江区'
        },
        {
          value: '310118',
          label: '青浦区'
        },
        {
          value: '310120',
          label: '奉贤区'
        },
        {
          value: '310151',
          label: '崇明区'
        }
      ],
      value: '310100',
      label: '上海'
    }
  ],
  value: '310000',
  label: '上海'
}]
/**
 * 产品类型
 * @type {{"01": string, "02": string, "03": string}}
 */
const productType = {
  'HJBI': '沪家保'
}
/**
 * 支付方式
 * @type {{"01": string, "02": string, "03": string}}
 */
const payMode = {
  '01': '转账'
}
/**
 * 保单状态
 * @type {{"01": string, "02": string, "03": string}}
 */
const status = {
  '01': '未生效',
  '02': '已生效',
  '03': '已退保'
}
/**
 * 案件状态 和 子赔案状态
 * @type {{"01": string, "02": string, "03": string}}
 */
const caseStatus = {
  '01': '报案',
  '02': '立案',
  '03': '理算',
  '05': '结案',
  '06': '注销',
  '07': '拒赔',
  '08': '查勘',
  '12': '调度',
  '13': '核赔',
  '14': '赔付确认'
}
/**
 * 延迟报案原因
 * @type {{"01": string, "02": string, "03": string, "04": string, "05": string, "06": string}}
 */
const delayReportReason = {
  '01': '忘记有保单',
  '02': '忘记报案',
  '03': '事故原因不明',
  '04': '无事故证明',
  '05': '事故现场封闭',
  '06': '其他原因'
}
/**
 * 出险原因
 * @type {{"01": string, "02": string, "03": string, "04": string, "05": string, "06": string, "07": string, "08": string, "09": string}}
 */
const reportReason = {
  '01': '爆炸',
  '02': '火灾',
  '03': '台风',
  '04': '暴风',
  '05': '暴雨',
  '06': '雷击',
  '07': '管道破裂',
  '08': '高空物体坠落',
  '99': '其他意外事故'
}
/**
 * 是否代码
 * @type {{"0": string, "1": string}}
 */
const isCode = {
  '1': '是',
  '0': '否'
}
/**
 * 报案方式
 * @type {{"0": string, "1": string}}
 */
const reportType = {
  '01': '前端报案',
  '02': '400电话报案',
  '03': '核心报案'
}
/**
 * 与出险人关系
 * @type {{"01": string, "02": string, "03": string, "04": string, "05": string, "06": string, "07": string, "08": string, "09": string}}
 */
const relationship = {
  '01': '本人',
  '02': '配偶',
  '03': '父母',
  '04': '子女',
  '05': '兄弟姐妹',
  '06': '朋友',
  '07': '雇主',
  '08': '雇员',
  '09': '其他'
}
/**
 * 子赔案类型
 * @type {{"02": string, "03": string, "06": string, "07": string}}
 */
const childCompensationCategory = {
  '02': '标的物损',
  '03': '标的人伤',
  '06': '三者物损',
  '07': '三者人伤'
}
/**
 * 证件类型 01个人 02机构
 * @type {{"990": string, "111": string, "1": string, "2": string, "553": string, "3": string, "114": string, "411": string, "4": string, "115": string, "511": string, "5": string, "6": string, "414": string, "7": string, "118": string, "119": string, "5501": string, "516": string, "5502": string, "10": string}}
 */
const certificationCategory = {
  '111': '居民身份证',
  '114': '中国人民解放军军官证',
  '115': '中国人民武装警察部队警官证',
  '118': '中国人民解放军士兵证',
  '119': '中国人民武装警察部队士兵证',
  '411': '外交护照',
  '414': '普通护照',
  '511': '台湾居民来往大陆通行证',
  '516': '港澳居民来往内地通行证',
  '550': '港澳台居民居住证',
  '553': '外国人永久居留证',
  '559': '文职干部证',
  '990': '其他',
  '1': '组织机构代码证',
  '2': '税务登记证',
  '3': '营业执照',
  '4': '事业单位法人证书',
  '5': '社会团体法人证书',
  '6': '民办非企业单位登记证书',
  '7': '基金会法人登记证书',
  '10': '统一社会信用代码'
}
/**
 * 性别代码
 * @type {{"0": string, "1": string, "2": string, "9": string}}
 */
const genderCode = {
  '0': '未知的性别',
  '1': '男性',
  '2': '女性',
  '9': '未说明的性别'
}
/**
 * 伤情类别
 * @type {{"01": string, "02": string}}
 */
const injuryCategory = {
  '01': '伤残',
  '02': '死亡'
}
/**
 * 伤残等级
 * @type {{"01": string, "02": string, "03": string, "04": string, "05": string, "06": string, "07": string, "08": string, "09": string, "10": string}}
 */
const injuryLevel = {
  '01': '1',
  '02': '2',
  '03': '3',
  '04': '4',
  '05': '5',
  '06': '6',
  '07': '7',
  '08': '8',
  '09': '9',
  '10': '10'
}
/**
 * 治疗方式
 * @type {{"01": string, "02": string}}
 */
const cureWay = {
  '01': '住院',
  '02': '门诊'
}
/**
 * 注销原因
 * @type {{"01": string, "02": string}}
 */
const cancelReason = {
  '01': '重复索赔',
  '03': '被保险人取消',
  '06': '错误报案',
  '05': '其他'
}
/**
 * 任务类型
 * @type {{"01": string, "02": string}}
 */
const missionCategory = {
  '01': '查勘',
  '02': '理算'
}
/**
 * 查勘方式
 * @type {{"01": string, "02": string}}
 */
const surveyWay = {
  '01': '自查勘',
  '02': '委外查勘',
  '03': '自助查勘'
}
/**
 * 房屋使用性质
 * @type {{"01": string, "02": string, "03": string}}
 */
const buildingCategory = {
  '01': '自住',
  '02': '出租',
  '03': '租赁'
}
/**
 * 伤情程度
 * @type {{"01": string, "02": string, "03": string}}
 */
const injuryDegree = {
  '01': '轻微伤',
  '02': '轻伤',
  '03': '重伤'
}
/**
 * 损失项目类型
 * @type {{"99": string, "01": string, "02": string, "03": string, "04": string, "05": string, "06": string, "07": string, "08": string}}
 */
const lossCategory = {
  '01': '医疗费',
  '02': '营养费',
  '03': '护理费',
  '04': '伤残赔偿金',
  '05': '死亡赔偿金',
  '06': '误工费',
  '07': '交通费',
  '08': '住院津贴',
  '99': '其他'
}
/**
 * 定损类型
 * @type {{"01": string, "02": string}}
 */
const lossAssessmentCategory = {
  '01': '以修代赔',
  '02': '现金赔付'
}
/**
 * 赔偿类型
 * @type {{"01": string, "02": string, "03": string, "04": string, "05": string, "06": string, "07": string, "09": string}}
 */
const compensationCategory = {
  'H01': '损失（赔款）',
  'H02': '检验费',
  'H03': '诉讼费',
  'H04': '律师费',
  'H05': '鉴定费',
  'H06': '检测费',
  'H07': '差旅费',
  'H99': '其他'
}
/**
 * 对公/对私
 * @type {{"01": string, "02": string}}
 */
const transferCategory = {
  '01': '对公',
  '02': '对私'
}
/**
 * 银行代码（需业务提供）
 * @type {{"593": string, "594": string, "595": string, "596": string, "597": string, "751": string, "598": string, "631": string, "752": string, "511": string, "632": string, "512": string, "633": string, "513": string, "514": string, "999": string, "001": string, "761": string, "641": string, "762": string, "521": string, "522": string, "523": string, "765": string, "403": string, "524": string, "525": string, "767": string, "526": string, "527": string, "528": string, "529": string, "011": string, "771": string, "651": string, "531": string, "773": string, "532": string, "533": string, "775": string, "534": string, "776": string, "781": string, "782": string, "662": string, "301": string, "302": string, "303": string, "787": string, "304": string, "305": string, "306": string, "307": string, "308": string, "309": string, "671": string, "310": string, "673": string, "315": string, "316": string, "712": string, "713": string, "318": string, "319": string, "716": string, "717": string, "681": string, "561": string, "682": string, "683": string, "321": string, "563": string, "201": string, "322": string, "564": string, "565": string, "203": string, "566": string, "325": string, "567": string, "326": string, "691": string, "694": string, "695": string, "731": string, "611": string, "732": string, "616": string, "581": string, "102": string, "103": string, "741": string, "104": string, "621": string, "742": string, "105": string, "501": string, "502": string, "623": string, "503": string, "504": string, "506": string, "507": string, "508": string}}
 */
const bank = {
  '001': '中国人民银行',
  '011': '国家金库',
  '102': '中国工商银行',
  '103': '中国农业银行',
  '104': '中国银行',
  '105': '建设银行',
  '201': '国家开发银行',
  '203': '中国农业发展银行',
  '301': '交通银行',
  '302': '中信银行',
  '303': '中国光大银行',
  '304': '华夏银行',
  '305': '中国民生银行',
  '306': '广发银行',
  '307': '平安银行',
  '308': '招商银行',
  '309': '兴业银行',
  '310': '上海浦东发展银行',
  '315': '恒丰银行',
  '316': '浙商银行',
  '318': '渤海银行',
  '319': '徽商银行',
  '321': '重庆三峡银行',
  '322': '上海农商银行',
  '325': '上海银行',
  '326': '中信百信银行',
  '403': '中国邮政储蓄银行',
  '501': '汇丰银行',
  '502': '东亚银行',
  '503': '南洋商业银行',
  '504': '恒生银行',
  '506': '集友银行',
  '507': '创兴银行',
  '508': '大众银行',
  '511': '上海商业银行',
  '512': '永隆银行',
  '513': '大兴银行',
  '514': '中信银行',
  '521': '华南商业银行',
  '522': '彰化商业银行',
  '523': '国泰世华商业银行',
  '524': '合作金库商业银行',
  '525': '第一商业银行',
  '526': '台湾土地银行',
  '527': '兆丰国际商业银行',
  '528': '台湾银行',
  '529': '玉山银行',
  '531': '花旗银行',
  '532': '美国银行',
  '533': '摩根大通银行',
  '534': '美国建东银行',
  '561': '三菱东京日联银行',
  '563': '三井住友银行',
  '564': '瑞穗银行',
  '565': '日本山口银行',
  '566': '日本三井住友信托银行',
  '567': '日本横滨银行',
  '581': '挪威银行',
  '593': '友利银行',
  '594': '韩国产业银行',
  '595': '新韩银行',
  '596': '企业银行',
  '597': '韩亚银行',
  '598': '国民银行',
  '611': '马来西亚银行',
  '616': '首都银行',
  '621': '华侨永亨银行',
  '622': '大华银行',
  '623': '星展银行',
  '631': '盘古银行',
  '632': '泰谷泰京银行',
  '633': '太泰银行',
  '641': '奥地利奥合国际银行',
  '651': '比利时联合银行',
  '662': '荷兰安智银行',
  '671': '渣打银行',
  '673': '英国巴克莱银行',
  '681': '瑞典商业银行',
  '682': '瑞典北欧斯安银行',
  '683': '瑞典银行',
  '691': '法国兴业银行',
  '694': '东方汇理银行',
  '695': '法国外贸银行',
  '712': '德意志银行',
  '713': '德国商业银行',
  '716': '德国北德意志州银行',
  '717': '中德住房储蓄银行',
  '731': '意大利裕信银行',
  '732': '意大利联合圣保罗银行',
  '741': '瑞士信贷银行',
  '742': '瑞士银行(中国)',
  '751': '加拿大丰业银行',
  '752': '蒙特利尔银行（中国）',
  '761': '澳大利亚和新西兰银行（中国）',
  '762': '澳大利亚西太平洋银行',
  '765': '西班牙桑坦德银行',
  '767': '俄罗斯外贸银行',
  '771': '摩根士丹利国际银行（中国）',
  '773': '新联商业银行',
  '775': '华美银行(中国)',
  '776': '荷兰合作银行',
  '781': '厦门国际银行',
  '782': '法国巴黎银行（中国）',
  '785': '华商银行',
  '787': '富邦华一银行',
  '999': '其他'
}
/**
 * 上传影像-业务类型
 * @type {{"001": string, "002": string}}
 */
const uploadCategory = {
  '001': '理赔',
  '002': '承保'
}
/**
 * 上传影像-目录
 * @type {{"001": string, "002": string, "003": string, "004": string}}
 */
const uploadType = {
  '001': '现场照片、损失照片',
  '002': '事故报告',
  '003': '损失资料',
  '004': '其他'
}
/**
 * 操作类型
 * @type {{"01": string, "02": string, "03": string, "04": string}}
 */
const operationType = {
  '01': '新增',
  '02': '删除',
  '03': '修改'
}
/**
 * 拒赔原因
 * @type {{"01": string, "02": string, "04": string, "05": string, "06": string, "07": string, "09": string}}
 */
const rejectReason = {
  '01': '重复索赔',
  '02': '利于判决',
  '04': '第三方有罪',
  '05': '无证',
  '06': '被保险人取消',
  '07': '第三方取消',
  '09': '其他'
}
/**
 * 审核意见
 * @type {{"01": string, "02": string}}
 */
const approveOpinion = {
  '01': '同意',
  '02': '不同意'
}
/**
 * 预估损失状态
 * @type {{"01": string, "02": string, "03": string}}
 */
const estimatedDamageStatus = {
  '01': '开启',
  '02': '关闭',
  '03': '重开'
}
/**
 * 预估损失更新类型
 * @type {{"01": string, "02": string, "03": string}}
 */
const estimatedDamageUpdateCategory = {
  '01': '人工修改',
  '02': '拒赔',
  '03': '创建',
  '05': '核赔',
  '06': '核赔前调整',
  '08': '重开',
  '11': '追偿申请',
  '14': '追偿处理前调整',
  '15': '追偿处理',
  '16': '注销',
  '17': '查勘'
}
/**
 * 重开原因
 * @type {{"01": string, "02": string, "03": string, "04": string}}
 */
const reopenReason = {
  '01': '错误关闭',
  '02': '诉讼',
  '03': '新建赔款/回收',
  '04': '其他'
}
/**
 * 第三方机构角色
 * @type {{"01": string, "02": string}}
 */
const thirdRole = {
  '01': '委外机构',
  '02': '维修供应商'
}
/**
 * 状态
 * @type {{"01": string, "02": string}}
 */
const active = {
  '01': '有效',
  '02': '无效'
}
/**
 * 第三方机构地址类型
 * @type {{"01": string, "02": string}}
 */
const thirdAddressCategory = {
  '01': '工作地方',
  '02': '家'
}
/**
 * 消息生成类型
 * @type {{"01": string, "02": string}}
 */
const messageGenerateType = {
  '01': '手工',
  '02': '自动'
}
/**
 * 理算金额计算公式代码
 * @type {{"01": string, "02": string}}
 */
const calculationFormula = {
  'H01': '理算金额=累计理算确认金额-前次累计理算确认金额=累计损失金额*事故责任比例-免赔额-前次累计理算确认金额',
  'H02': '理算金额=(保额-已赔付金额)-前次累计理算确认金额'
}
export default {
  thirdAddressCategory,
  reportType,
  operationType,
  rejectReason,
  approveOpinion,
  estimatedDamageStatus,
  estimatedDamageUpdateCategory,
  reopenReason,
  thirdRole,
  active,
  messageGenerateType,
  cancelReason,
  caseStatus,
  status,
  delayReportReason,
  reportReason,
  isCode,
  relationship,
  childCompensationCategory,
  certificationCategory,
  genderCode,
  injuryCategory,
  injuryLevel,
  cureWay,
  missionCategory,
  buildingCategory,
  injuryDegree,
  lossCategory,
  lossAssessmentCategory,
  compensationCategory,
  transferCategory,
  bank,
  uploadCategory,
  uploadType,
  surveyWay,
  orderStatus,
  payMode,
  KeyMap,
  areaList,
  calculationFormula,
  productType
}
