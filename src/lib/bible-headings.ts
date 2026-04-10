// Bible section headings mapped by "Book Chapter" -> [{verse, heading}]
// Covers key books first; more can be added over time.

export const SECTION_HEADINGS: Record<string, { verse: number; heading: string }[]> = {
  // ============ GENESIS ============
  "Genesis 1": [
    { verse: 1, heading: "The Creation of the World" },
    { verse: 14, heading: "The Fourth Day: Sun, Moon, and Stars" },
    { verse: 24, heading: "The Sixth Day: Land Animals and Humans" },
  ],
  "Genesis 2": [
    { verse: 1, heading: "The Seventh Day: God Rests" },
    { verse: 4, heading: "The Garden of Eden" },
    { verse: 18, heading: "The Creation of Woman" },
  ],
  "Genesis 3": [
    { verse: 1, heading: "The Fall of Man" },
    { verse: 14, heading: "God's Judgment" },
    { verse: 22, heading: "Banished from the Garden" },
  ],
  "Genesis 4": [
    { verse: 1, heading: "Cain and Abel" },
    { verse: 17, heading: "The Line of Cain" },
    { verse: 25, heading: "Seth and Enosh" },
  ],
  "Genesis 5": [{ verse: 1, heading: "From Adam to Noah" }],
  "Genesis 6": [
    { verse: 1, heading: "Wickedness in the World" },
    { verse: 9, heading: "Noah and the Ark" },
  ],
  "Genesis 7": [{ verse: 1, heading: "The Great Flood" }],
  "Genesis 8": [
    { verse: 1, heading: "The Flood Recedes" },
    { verse: 20, heading: "God's Promise to Noah" },
  ],
  "Genesis 9": [
    { verse: 1, heading: "God's Covenant with Noah" },
    { verse: 18, heading: "Noah's Sons" },
  ],
  "Genesis 10": [{ verse: 1, heading: "The Table of Nations" }],
  "Genesis 11": [
    { verse: 1, heading: "The Tower of Babel" },
    { verse: 10, heading: "From Shem to Abram" },
  ],
  "Genesis 12": [
    { verse: 1, heading: "The Call of Abram" },
    { verse: 10, heading: "Abram in Egypt" },
  ],
  "Genesis 15": [{ verse: 1, heading: "God's Covenant with Abram" }],
  "Genesis 17": [
    { verse: 1, heading: "The Covenant of Circumcision" },
    { verse: 15, heading: "The Promise of Isaac" },
  ],
  "Genesis 18": [
    { verse: 1, heading: "Three Visitors" },
    { verse: 16, heading: "Abraham Pleads for Sodom" },
  ],
  "Genesis 19": [
    { verse: 1, heading: "The Destruction of Sodom and Gomorrah" },
    { verse: 30, heading: "Lot's Daughters" },
  ],
  "Genesis 21": [
    { verse: 1, heading: "The Birth of Isaac" },
    { verse: 8, heading: "Hagar and Ishmael Sent Away" },
  ],
  "Genesis 22": [{ verse: 1, heading: "The Sacrifice of Isaac" }],
  "Genesis 24": [{ verse: 1, heading: "Isaac and Rebekah" }],
  "Genesis 25": [
    { verse: 19, heading: "Jacob and Esau" },
    { verse: 29, heading: "Esau Sells His Birthright" },
  ],
  "Genesis 27": [{ verse: 1, heading: "Jacob Steals Esau's Blessing" }],
  "Genesis 28": [{ verse: 10, heading: "Jacob's Dream at Bethel" }],
  "Genesis 32": [{ verse: 22, heading: "Jacob Wrestles with God" }],
  "Genesis 37": [
    { verse: 1, heading: "Joseph's Dreams" },
    { verse: 12, heading: "Joseph Sold by His Brothers" },
  ],
  "Genesis 39": [{ verse: 1, heading: "Joseph in Potiphar's House" }],
  "Genesis 40": [{ verse: 1, heading: "Joseph Interprets Dreams in Prison" }],
  "Genesis 41": [
    { verse: 1, heading: "Pharaoh's Dreams" },
    { verse: 37, heading: "Joseph Made Ruler of Egypt" },
  ],
  "Genesis 45": [{ verse: 1, heading: "Joseph Reveals Himself to His Brothers" }],
  "Genesis 50": [
    { verse: 1, heading: "The Death of Jacob" },
    { verse: 15, heading: "Joseph Reassures His Brothers" },
  ],

  // ============ EXODUS ============
  "Exodus 1": [
    { verse: 1, heading: "Israel Oppressed in Egypt" },
    { verse: 15, heading: "The Hebrew Midwives" },
  ],
  "Exodus 2": [
    { verse: 1, heading: "The Birth of Moses" },
    { verse: 11, heading: "Moses Flees to Midian" },
  ],
  "Exodus 3": [{ verse: 1, heading: "The Burning Bush" }],
  "Exodus 7": [{ verse: 14, heading: "The First Plague: Water to Blood" }],
  "Exodus 12": [
    { verse: 1, heading: "The Passover" },
    { verse: 29, heading: "The Tenth Plague: Death of the Firstborn" },
  ],
  "Exodus 14": [{ verse: 1, heading: "Crossing the Red Sea" }],
  "Exodus 20": [{ verse: 1, heading: "The Ten Commandments" }],

  // ============ PSALMS (selected) ============
  "Psalms 1": [{ verse: 1, heading: "The Way of the Righteous and the Wicked" }],
  "Psalms 23": [{ verse: 1, heading: "The Lord Is My Shepherd" }],
  "Psalms 51": [{ verse: 1, heading: "A Prayer of Repentance" }],
  "Psalms 91": [{ verse: 1, heading: "Abiding in the Shadow of the Almighty" }],
  "Psalms 100": [{ verse: 1, heading: "A Psalm of Thanksgiving" }],
  "Psalms 119": [
    { verse: 1, heading: "The Glories of God's Word" },
    { verse: 9, heading: "Beth" },
    { verse: 17, heading: "Gimel" },
    { verse: 25, heading: "Daleth" },
    { verse: 33, heading: "He" },
    { verse: 41, heading: "Waw" },
    { verse: 49, heading: "Zayin" },
    { verse: 57, heading: "Heth" },
    { verse: 65, heading: "Teth" },
    { verse: 73, heading: "Yodh" },
    { verse: 81, heading: "Kaph" },
    { verse: 89, heading: "Lamedh" },
    { verse: 97, heading: "Mem" },
    { verse: 105, heading: "Nun" },
    { verse: 113, heading: "Samekh" },
    { verse: 121, heading: "Ayin" },
    { verse: 129, heading: "Pe" },
    { verse: 137, heading: "Tsadhe" },
    { verse: 145, heading: "Qoph" },
    { verse: 153, heading: "Resh" },
    { verse: 161, heading: "Sin and Shin" },
    { verse: 169, heading: "Taw" },
  ],
  "Psalms 139": [{ verse: 1, heading: "God's Perfect Knowledge" }],
  "Psalms 150": [{ verse: 1, heading: "Praise the Lord!" }],

  // ============ PROVERBS (selected) ============
  "Proverbs 1": [
    { verse: 1, heading: "The Purpose of Proverbs" },
    { verse: 8, heading: "A Father's Instruction" },
    { verse: 20, heading: "Wisdom Calls Out" },
  ],
  "Proverbs 3": [
    { verse: 1, heading: "Trust in the Lord" },
    { verse: 13, heading: "The Value of Wisdom" },
  ],
  "Proverbs 31": [
    { verse: 1, heading: "The Words of King Lemuel" },
    { verse: 10, heading: "The Virtuous Woman" },
  ],

  // ============ ISAIAH (selected) ============
  "Isaiah 6": [{ verse: 1, heading: "Isaiah's Vision of the Lord" }],
  "Isaiah 7": [{ verse: 10, heading: "The Sign of Immanuel" }],
  "Isaiah 9": [{ verse: 1, heading: "A Child Is Born" }],
  "Isaiah 40": [
    { verse: 1, heading: "Comfort for God's People" },
    { verse: 27, heading: "The Everlasting God" },
  ],
  "Isaiah 53": [{ verse: 1, heading: "The Suffering Servant" }],
  "Isaiah 55": [{ verse: 1, heading: "An Invitation to the Thirsty" }],

  // ============ MATTHEW ============
  "Matthew 1": [
    { verse: 1, heading: "The Genealogy of Jesus" },
    { verse: 18, heading: "The Birth of Jesus Christ" },
  ],
  "Matthew 2": [
    { verse: 1, heading: "The Visit of the Wise Men" },
    { verse: 13, heading: "The Flight to Egypt" },
    { verse: 16, heading: "Herod Kills the Children" },
  ],
  "Matthew 3": [
    { verse: 1, heading: "John the Baptist Prepares the Way" },
    { verse: 13, heading: "The Baptism of Jesus" },
  ],
  "Matthew 4": [
    { verse: 1, heading: "The Temptation of Jesus" },
    { verse: 12, heading: "Jesus Begins His Ministry" },
    { verse: 18, heading: "Jesus Calls His First Disciples" },
  ],
  "Matthew 5": [
    { verse: 1, heading: "The Sermon on the Mount" },
    { verse: 3, heading: "The Beatitudes" },
    { verse: 13, heading: "Salt and Light" },
    { verse: 17, heading: "Christ Fulfills the Law" },
    { verse: 21, heading: "Teaching About Anger" },
    { verse: 27, heading: "Teaching About Lust" },
    { verse: 33, heading: "Teaching About Oaths" },
    { verse: 38, heading: "Teaching About Retaliation" },
    { verse: 43, heading: "Love Your Enemies" },
  ],
  "Matthew 6": [
    { verse: 1, heading: "Teaching About Giving" },
    { verse: 5, heading: "Teaching About Prayer" },
    { verse: 9, heading: "The Lord's Prayer" },
    { verse: 16, heading: "Teaching About Fasting" },
    { verse: 19, heading: "Treasures in Heaven" },
    { verse: 25, heading: "Do Not Worry" },
  ],
  "Matthew 7": [
    { verse: 1, heading: "Do Not Judge" },
    { verse: 7, heading: "Ask, Seek, Knock" },
    { verse: 13, heading: "The Narrow Gate" },
    { verse: 15, heading: "A Tree and Its Fruit" },
    { verse: 24, heading: "Build Your House on the Rock" },
  ],
  "Matthew 8": [
    { verse: 1, heading: "Jesus Heals a Leper" },
    { verse: 5, heading: "The Centurion's Faith" },
    { verse: 14, heading: "Jesus Heals Many" },
    { verse: 23, heading: "Jesus Calms the Storm" },
    { verse: 28, heading: "Jesus Heals Two Demon-Possessed Men" },
  ],
  "Matthew 13": [
    { verse: 1, heading: "The Parable of the Sower" },
    { verse: 24, heading: "The Parable of the Weeds" },
    { verse: 31, heading: "The Parables of the Mustard Seed and Leaven" },
    { verse: 44, heading: "The Parables of Hidden Treasure and the Pearl" },
  ],
  "Matthew 14": [
    { verse: 1, heading: "The Death of John the Baptist" },
    { verse: 13, heading: "Jesus Feeds Five Thousand" },
    { verse: 22, heading: "Jesus Walks on Water" },
  ],
  "Matthew 16": [
    { verse: 13, heading: "Peter's Confession of Christ" },
    { verse: 21, heading: "Jesus Predicts His Death" },
    { verse: 24, heading: "Take Up Your Cross" },
  ],
  "Matthew 17": [{ verse: 1, heading: "The Transfiguration" }],
  "Matthew 18": [
    { verse: 1, heading: "Who Is the Greatest?" },
    { verse: 10, heading: "The Parable of the Lost Sheep" },
    { verse: 21, heading: "The Parable of the Unforgiving Servant" },
  ],
  "Matthew 19": [
    { verse: 1, heading: "Teaching About Divorce" },
    { verse: 13, heading: "Jesus Blesses the Children" },
    { verse: 16, heading: "The Rich Young Man" },
  ],
  "Matthew 20": [
    { verse: 1, heading: "The Parable of the Workers in the Vineyard" },
    { verse: 29, heading: "Jesus Heals Two Blind Men" },
  ],
  "Matthew 21": [
    { verse: 1, heading: "The Triumphal Entry" },
    { verse: 12, heading: "Jesus Cleanses the Temple" },
  ],
  "Matthew 22": [
    { verse: 1, heading: "The Parable of the Wedding Feast" },
    { verse: 15, heading: "Paying Taxes to Caesar" },
    { verse: 34, heading: "The Greatest Commandment" },
  ],
  "Matthew 24": [
    { verse: 1, heading: "Jesus Foretells the Future" },
    { verse: 36, heading: "No One Knows the Day or Hour" },
  ],
  "Matthew 25": [
    { verse: 1, heading: "The Parable of the Ten Virgins" },
    { verse: 14, heading: "The Parable of the Talents" },
    { verse: 31, heading: "The Final Judgment" },
  ],
  "Matthew 26": [
    { verse: 1, heading: "The Plot to Kill Jesus" },
    { verse: 17, heading: "The Last Supper" },
    { verse: 36, heading: "Jesus Prays in Gethsemane" },
    { verse: 47, heading: "The Betrayal and Arrest of Jesus" },
    { verse: 57, heading: "Jesus Before the Council" },
    { verse: 69, heading: "Peter Denies Jesus" },
  ],
  "Matthew 27": [
    { verse: 1, heading: "Jesus Before Pilate" },
    { verse: 27, heading: "Jesus Is Mocked" },
    { verse: 32, heading: "The Crucifixion" },
    { verse: 57, heading: "The Burial of Jesus" },
  ],
  "Matthew 28": [
    { verse: 1, heading: "The Resurrection" },
    { verse: 16, heading: "The Great Commission" },
  ],

  // ============ MARK ============
  "Mark 1": [
    { verse: 1, heading: "John the Baptist Prepares the Way" },
    { verse: 9, heading: "The Baptism of Jesus" },
    { verse: 12, heading: "The Temptation of Jesus" },
    { verse: 14, heading: "Jesus Begins His Ministry" },
    { verse: 16, heading: "Jesus Calls His First Disciples" },
    { verse: 21, heading: "Jesus Drives Out an Unclean Spirit" },
    { verse: 29, heading: "Jesus Heals Many" },
  ],
  "Mark 4": [
    { verse: 1, heading: "The Parable of the Sower" },
    { verse: 35, heading: "Jesus Calms the Storm" },
  ],
  "Mark 5": [
    { verse: 1, heading: "Jesus Heals a Demon-Possessed Man" },
    { verse: 21, heading: "Jesus Heals a Woman and Raises a Girl" },
  ],
  "Mark 6": [
    { verse: 1, heading: "Jesus Rejected at Nazareth" },
    { verse: 14, heading: "The Death of John the Baptist" },
    { verse: 30, heading: "Jesus Feeds Five Thousand" },
    { verse: 45, heading: "Jesus Walks on Water" },
  ],
  "Mark 10": [
    { verse: 13, heading: "Jesus Blesses the Children" },
    { verse: 17, heading: "The Rich Young Man" },
    { verse: 46, heading: "Blind Bartimaeus" },
  ],
  "Mark 11": [{ verse: 1, heading: "The Triumphal Entry" }],
  "Mark 14": [
    { verse: 12, heading: "The Last Supper" },
    { verse: 32, heading: "Jesus Prays in Gethsemane" },
    { verse: 43, heading: "The Betrayal and Arrest of Jesus" },
  ],
  "Mark 15": [
    { verse: 1, heading: "Jesus Before Pilate" },
    { verse: 21, heading: "The Crucifixion" },
    { verse: 42, heading: "The Burial of Jesus" },
  ],
  "Mark 16": [{ verse: 1, heading: "The Resurrection" }],

  // ============ LUKE ============
  "Luke 1": [
    { verse: 1, heading: "Introduction" },
    { verse: 5, heading: "The Birth of John the Baptist Foretold" },
    { verse: 26, heading: "The Birth of Jesus Foretold" },
    { verse: 39, heading: "Mary Visits Elizabeth" },
    { verse: 46, heading: "Mary's Song of Praise" },
    { verse: 57, heading: "The Birth of John the Baptist" },
    { verse: 67, heading: "Zechariah's Prophecy" },
  ],
  "Luke 2": [
    { verse: 1, heading: "The Birth of Jesus" },
    { verse: 8, heading: "The Shepherds and the Angels" },
    { verse: 22, heading: "Jesus Presented at the Temple" },
    { verse: 41, heading: "The Boy Jesus at the Temple" },
  ],
  "Luke 4": [
    { verse: 1, heading: "The Temptation of Jesus" },
    { verse: 14, heading: "Jesus Rejected at Nazareth" },
  ],
  "Luke 10": [
    { verse: 1, heading: "Jesus Sends Out the Seventy-Two" },
    { verse: 25, heading: "The Parable of the Good Samaritan" },
    { verse: 38, heading: "Jesus Visits Martha and Mary" },
  ],
  "Luke 15": [
    { verse: 1, heading: "The Parable of the Lost Sheep" },
    { verse: 8, heading: "The Parable of the Lost Coin" },
    { verse: 11, heading: "The Parable of the Prodigal Son" },
  ],
  "Luke 22": [
    { verse: 1, heading: "The Plot to Kill Jesus" },
    { verse: 7, heading: "The Last Supper" },
    { verse: 39, heading: "Jesus Prays on the Mount of Olives" },
    { verse: 47, heading: "The Betrayal and Arrest of Jesus" },
    { verse: 54, heading: "Peter Denies Jesus" },
  ],
  "Luke 23": [
    { verse: 1, heading: "Jesus Before Pilate and Herod" },
    { verse: 26, heading: "The Crucifixion" },
    { verse: 44, heading: "The Death of Jesus" },
    { verse: 50, heading: "The Burial of Jesus" },
  ],
  "Luke 24": [
    { verse: 1, heading: "The Resurrection" },
    { verse: 13, heading: "On the Road to Emmaus" },
    { verse: 36, heading: "Jesus Appears to His Disciples" },
    { verse: 50, heading: "The Ascension" },
  ],

  // ============ JOHN ============
  "John 1": [
    { verse: 1, heading: "The Word Became Flesh" },
    { verse: 19, heading: "The Testimony of John the Baptist" },
    { verse: 35, heading: "Jesus Calls His First Disciples" },
    { verse: 43, heading: "Jesus Calls Philip and Nathanael" },
  ],
  "John 2": [
    { verse: 1, heading: "The Wedding at Cana" },
    { verse: 13, heading: "Jesus Cleanses the Temple" },
  ],
  "John 3": [
    { verse: 1, heading: "Jesus and Nicodemus" },
    { verse: 16, heading: "For God So Loved the World" },
    { verse: 22, heading: "John the Baptist Exalts Christ" },
  ],
  "John 4": [
    { verse: 1, heading: "Jesus and the Woman at the Well" },
    { verse: 43, heading: "Jesus Heals an Official's Son" },
  ],
  "John 5": [
    { verse: 1, heading: "Jesus Heals at the Pool of Bethesda" },
    { verse: 19, heading: "The Authority of the Son" },
  ],
  "John 6": [
    { verse: 1, heading: "Jesus Feeds Five Thousand" },
    { verse: 16, heading: "Jesus Walks on Water" },
    { verse: 22, heading: "Jesus the Bread of Life" },
    { verse: 60, heading: "Many Disciples Turn Away" },
  ],
  "John 7": [
    { verse: 1, heading: "Jesus at the Feast of Tabernacles" },
    { verse: 37, heading: "Rivers of Living Water" },
  ],
  "John 8": [
    { verse: 1, heading: "The Woman Caught in Adultery" },
    { verse: 12, heading: "Jesus the Light of the World" },
    { verse: 31, heading: "The Truth Will Set You Free" },
  ],
  "John 9": [{ verse: 1, heading: "Jesus Heals a Man Born Blind" }],
  "John 10": [
    { verse: 1, heading: "Jesus the Good Shepherd" },
    { verse: 22, heading: "Jesus at the Feast of Dedication" },
  ],
  "John 11": [
    { verse: 1, heading: "The Death of Lazarus" },
    { verse: 17, heading: "Jesus Comforts Martha and Mary" },
    { verse: 38, heading: "Jesus Raises Lazarus" },
    { verse: 45, heading: "The Plot to Kill Jesus" },
  ],
  "John 12": [
    { verse: 1, heading: "Mary Anoints Jesus" },
    { verse: 12, heading: "The Triumphal Entry" },
    { verse: 20, heading: "Jesus Predicts His Death" },
  ],
  "John 13": [
    { verse: 1, heading: "Jesus Washes the Disciples' Feet" },
    { verse: 18, heading: "Jesus Predicts His Betrayal" },
    { verse: 31, heading: "A New Commandment" },
    { verse: 36, heading: "Jesus Predicts Peter's Denial" },
  ],
  "John 14": [
    { verse: 1, heading: "Jesus Comforts His Disciples" },
    { verse: 5, heading: "I Am the Way, the Truth, and the Life" },
    { verse: 15, heading: "The Promise of the Holy Spirit" },
  ],
  "John 15": [
    { verse: 1, heading: "I Am the True Vine" },
    { verse: 12, heading: "The Greatest Love" },
    { verse: 18, heading: "The World's Hatred" },
  ],
  "John 16": [
    { verse: 1, heading: "The Work of the Holy Spirit" },
    { verse: 16, heading: "Sorrow Will Turn to Joy" },
    { verse: 25, heading: "Jesus Has Overcome the World" },
  ],
  "John 17": [
    { verse: 1, heading: "Jesus Prays for Himself" },
    { verse: 6, heading: "Jesus Prays for His Disciples" },
    { verse: 20, heading: "Jesus Prays for All Believers" },
  ],
  "John 18": [
    { verse: 1, heading: "The Betrayal and Arrest of Jesus" },
    { verse: 12, heading: "Jesus Before the High Priest" },
    { verse: 15, heading: "Peter Denies Jesus" },
    { verse: 28, heading: "Jesus Before Pilate" },
  ],
  "John 19": [
    { verse: 1, heading: "Jesus Sentenced to Be Crucified" },
    { verse: 16, heading: "The Crucifixion" },
    { verse: 28, heading: "The Death of Jesus" },
    { verse: 38, heading: "The Burial of Jesus" },
  ],
  "John 20": [
    { verse: 1, heading: "The Empty Tomb" },
    { verse: 11, heading: "Jesus Appears to Mary Magdalene" },
    { verse: 19, heading: "Jesus Appears to His Disciples" },
    { verse: 24, heading: "Jesus and Thomas" },
  ],
  "John 21": [
    { verse: 1, heading: "Jesus Appears at the Sea of Galilee" },
    { verse: 15, heading: "Jesus Restores Peter" },
  ],

  // ============ ACTS ============
  "Acts 1": [
    { verse: 1, heading: "The Promise of the Holy Spirit" },
    { verse: 6, heading: "The Ascension" },
    { verse: 12, heading: "Matthias Chosen to Replace Judas" },
  ],
  "Acts 2": [
    { verse: 1, heading: "The Day of Pentecost" },
    { verse: 14, heading: "Peter's Sermon" },
    { verse: 37, heading: "The First Believers" },
    { verse: 42, heading: "The Fellowship of Believers" },
  ],
  "Acts 3": [
    { verse: 1, heading: "Peter Heals a Lame Man" },
    { verse: 11, heading: "Peter Speaks in Solomon's Portico" },
  ],
  "Acts 9": [
    { verse: 1, heading: "The Conversion of Saul" },
    { verse: 19, heading: "Saul Begins to Preach" },
  ],
  "Acts 10": [{ verse: 1, heading: "Peter and Cornelius" }],
  "Acts 17": [
    { verse: 1, heading: "Paul in Thessalonica and Berea" },
    { verse: 16, heading: "Paul in Athens" },
  ],

  // ============ ROMANS ============
  "Romans 1": [
    { verse: 1, heading: "Greetings from Paul" },
    { verse: 16, heading: "The Righteous Shall Live by Faith" },
    { verse: 18, heading: "God's Wrath Against Sin" },
  ],
  "Romans 3": [
    { verse: 1, heading: "God's Faithfulness" },
    { verse: 21, heading: "Righteousness Through Faith" },
  ],
  "Romans 5": [
    { verse: 1, heading: "Peace with God Through Faith" },
    { verse: 12, heading: "Death Through Adam, Life Through Christ" },
  ],
  "Romans 6": [
    { verse: 1, heading: "Dead to Sin, Alive in Christ" },
    { verse: 15, heading: "Slaves to Righteousness" },
  ],
  "Romans 7": [{ verse: 7, heading: "The Struggle with Sin" }],
  "Romans 8": [
    { verse: 1, heading: "Life in the Spirit" },
    { verse: 18, heading: "Future Glory" },
    { verse: 28, heading: "More Than Conquerors" },
  ],
  "Romans 10": [
    { verse: 1, heading: "Salvation for All Who Believe" },
    { verse: 14, heading: "How Beautiful Are the Feet" },
  ],
  "Romans 12": [
    { verse: 1, heading: "A Living Sacrifice" },
    { verse: 9, heading: "Marks of a True Christian" },
  ],
  "Romans 13": [
    { verse: 1, heading: "Submission to Authorities" },
    { verse: 8, heading: "Love Fulfills the Law" },
  ],

  // ============ 1 CORINTHIANS ============
  "1 Corinthians 13": [{ verse: 1, heading: "The Way of Love" }],
  "1 Corinthians 15": [
    { verse: 1, heading: "The Resurrection of Christ" },
    { verse: 35, heading: "The Resurrection Body" },
    { verse: 50, heading: "The Mystery of the Last Trumpet" },
  ],

  // ============ GALATIANS ============
  "Galatians 5": [
    { verse: 1, heading: "Freedom in Christ" },
    { verse: 16, heading: "Walking by the Spirit" },
    { verse: 22, heading: "The Fruit of the Spirit" },
  ],

  // ============ EPHESIANS ============
  "Ephesians 2": [
    { verse: 1, heading: "Made Alive in Christ" },
    { verse: 11, heading: "Unity in Christ" },
  ],
  "Ephesians 4": [
    { verse: 1, heading: "Unity in the Body of Christ" },
    { verse: 17, heading: "The New Life" },
  ],
  "Ephesians 6": [
    { verse: 1, heading: "Children and Parents" },
    { verse: 10, heading: "The Armor of God" },
  ],

  // ============ PHILIPPIANS ============
  "Philippians 2": [
    { verse: 1, heading: "Christ's Example of Humility" },
    { verse: 12, heading: "Shining as Lights in the World" },
  ],
  "Philippians 4": [
    { verse: 1, heading: "Rejoice in the Lord Always" },
    { verse: 6, heading: "Do Not Be Anxious" },
    { verse: 10, heading: "God's Provision" },
  ],

  // ============ HEBREWS ============
  "Hebrews 11": [{ verse: 1, heading: "By Faith" }],
  "Hebrews 12": [
    { verse: 1, heading: "The Race of Faith" },
    { verse: 4, heading: "God's Discipline" },
  ],

  // ============ JAMES ============
  "James 1": [
    { verse: 1, heading: "Greeting" },
    { verse: 2, heading: "Testing of Your Faith" },
    { verse: 19, heading: "Hearing and Doing the Word" },
  ],
  "James 2": [
    { verse: 1, heading: "Do Not Show Favoritism" },
    { verse: 14, heading: "Faith and Works" },
  ],
  "James 3": [{ verse: 1, heading: "Taming the Tongue" }],

  // ============ 1 JOHN ============
  "1 John 1": [{ verse: 1, heading: "Walking in the Light" }],
  "1 John 3": [{ verse: 1, heading: "Children of God" }],
  "1 John 4": [
    { verse: 1, heading: "Test the Spirits" },
    { verse: 7, heading: "God Is Love" },
  ],

  // ============ REVELATION ============
  "Revelation 1": [
    { verse: 1, heading: "Prologue" },
    { verse: 9, heading: "Vision of the Son of Man" },
  ],
  "Revelation 4": [{ verse: 1, heading: "The Throne in Heaven" }],
  "Revelation 5": [{ verse: 1, heading: "The Scroll and the Lamb" }],
  "Revelation 7": [{ verse: 9, heading: "A Great Multitude from Every Nation" }],
  "Revelation 19": [
    { verse: 1, heading: "The Marriage Supper of the Lamb" },
    { verse: 11, heading: "The Rider on the White Horse" },
  ],
  "Revelation 20": [
    { verse: 1, heading: "The Thousand Years" },
    { verse: 11, heading: "The Great White Throne Judgment" },
  ],
  "Revelation 21": [
    { verse: 1, heading: "A New Heaven and a New Earth" },
    { verse: 9, heading: "The New Jerusalem" },
  ],
  "Revelation 22": [
    { verse: 1, heading: "The River of Life" },
    { verse: 6, heading: "Jesus Is Coming Soon" },
  ],
};
