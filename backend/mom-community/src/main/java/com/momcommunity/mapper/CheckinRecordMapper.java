package com.momcommunity.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.momcommunity.entity.CheckinRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CheckinRecordMapper extends BaseMapper<CheckinRecord> {

    @Select("SELECT DISTINCT record_date FROM checkin_record WHERE user_id = #{userId} AND deleted = 0 AND record_date LIKE CONCAT(#{yearMonth}, '%')")
    List<String> selectCheckinDatesByMonth(@Param("userId") Long userId, @Param("yearMonth") String yearMonth);

    @Select("SELECT * FROM checkin_record WHERE user_id = #{userId} AND record_date = #{date} AND deleted = 0 ORDER BY create_time DESC")
    List<CheckinRecord> selectByUserIdAndDate(@Param("userId") Long userId, @Param("date") String date);
}
