const RULES = {
  OPEN_STAMP: {
    YFSSC: '每天1440期，00:00-23:59（1分钟一期）',
    QQSSC: '每天1440期，00:00-23:59（1分钟一期）',
    QIQUSSC: '每天1440期，00:00-23:59（1分钟一期）',
    HENEISSC: '每天1440期，00:00-23:59（1分钟一期）',
    JNDSSC: '每天960期，00:00-23:59（1.5分钟一期）',
    ELSSSC: '每天960期，00:00-23:59（1.5分钟一期）',
    BHDSSC: '每天960期，00:00-23:59（1.5分钟一期）',
    GGSSC: '每天960期，00:00-23:59（1.5分钟一期）',
    EFSSC: '每天720期，00:00-23:58（2分钟一期）',
    GXSSC: '每天720期，00:00-23:58（2分钟一期）',
    SFSSC: '每天420期，09:03-次日06:00（3分钟一期）',
    WFSSC: '每天288期，00:00-23:55（5分钟一期）',
    WF179SSC: '每天179期，09:05~23:55（5分钟一期）', // 179 5分
    FCSSC: '每天288期，00:00-23:55（5分钟一期）',
    TTSSC: '每天288期，00:00-23:55（5分钟一期）',
    SHFSSC: '每天144期，00:00-24:00（10分钟一期）',
    CQSSC: '每天59期，00:28-03:08（20分钟一期，共9期）07:28-23:48（20分钟一期，共50期）',
    XJSSC: '每天48期，10:18-02:18（20分钟一期）',
    TJSSC: '每天42期，09:18-22:58（20分钟一期）',
    AZXY5SSC: '每天开奖288期，全天24小时销售，每5分钟1期',
    // PK10
    BJPK10: '每天44期、每20分钟1期；每天早上09点28分至晚上11点48分',
    YFPK10: '每天1440期、每1分钟1期；每天凌晨00点00分至晚上11点59分',
    JSPK10: '每天1440期、每1分钟1期；每天凌晨00点00分至晚上11点59分',
    EFPK10: '每天720期、每2分钟1期；每天凌晨00点00分至晚上11点58分',
    SFPK10: '每天420期、每3分钟1期；每天早上09点03分至次日06点00分',
    WFFT: '每天180期、中午13:07开到凌晨04:02（5分钟一期）',
    XTWFFT: '每天180期、中午13:08开到凌晨04:03（5分钟一期）',
    WFPK10: '每天288期，00:00-23:55（5分钟一期）',
    SHFPK10: '每天144期，00:00-24:00（10分钟一期）',
    AZXYPK10: '每天开奖288期，全天24小时销售，每5分钟1期',
    // AHK3
    AHK3: '每天40期，08:58-21:58（20分钟一期）',
    JXK3: '每天42期，09:13-22:53（20分钟一期）',
    JSK3: '每天41期，08:48-22:08（20分钟一期）',
    BJK3: '每天44期，09:18-23:38（20分钟一期）',
    GXK3: '每天40期，09:28-22:28（20分钟一期）',
    HEBK3: '每天41期，08:55-22:15（20分钟一期）',
    HBK3: '每天39期，09:18-21:58（20分钟一期）',
    GSK3: '每天36期，10:18-21:58（20分钟一期）',
    SHK3: '每天41期，08:56-22:16（20分钟一期）',
    JLK3: '每天87期，08:29-22:49（10分钟一期）',
    WFK3: '每天252期，09:05-次日06:00（5分钟一期）',
    YFK3: '每天1051期，08:30-次日02:00（1分钟一期）',
    TJK3: '每天46期，08:56-23:56（20分钟一期）',
    XJK3: '每天46期，08:56-23:56（20分钟一期）',
    HNK3: '每天46期，08:56-23:56（20分钟一期）',
    SXK3: '每天46期，08:56-23:56（20分钟一期）',
    LNK3: '每天46期，08:56-23:56（20分钟一期）',
    SCK3: '每天46期，08:56-23:56（20分钟一期）',
    SFK3: '每天480期，00:00-24:00（3分钟一期）',
    SHFK3: '每天144期，00:00-24:00（10分钟一期）',
    FJK3: '每天42期，08:49-22:29（20分钟一期）',
    GZK3: '每天39期，09:29-22:09（20分钟一期）',
    // 11X5
    SD11X5: '每天87期，08:35-22:55（10分钟一期）',
    SH11X5: '每天90期，09:00-23:50（10分钟一期）',
    JX11X5: '每天84期，09:10-23:00（10分钟一期）',
    GD11X5: '每天42期，09:28-23:08（20分钟一期）',
    // 28
    BJ28: '每天179期，09:05-23:55（5分钟一期）',
    XY28: '每天420期，09:00-次日06:00（3分钟一期）',
    JND28: '每三分半钟开一期，开奖时间全天。于19:00~22:00之间进行维护，依照维护狀況有可能提早维护完毕。',
    YF28: '每天1051期，08:30-次日02:00（1分钟一期）',
    // HK6
    HKSIX: '每周三期，通常与周二、周四及周六或周日晚上举行。',
    WFHKSIX: '每天288期，00:04-23:59（5分钟一期）',
  },
};

export default RULES;
